import { SubCommandObject } from '../../../../utils/values/types/types'
import { TextContext } from '../../../../utils/values/types/contexts'
import BuckwheatCommand from '../../base/BuckwheatCommand'
import MessageUtils from '../../../../utils/MessageUtils'
import UserRankService from '../../../db/services/user/UserRankService'
import RankUtils from '../../../../utils/RankUtils'
import RulesService from '../../../db/services/chat/RulesService'
import SubCommandUtils from '../../../../utils/SubCommandUtils'
import LegacyInlineKeyboardManager from '../../../main/LegacyInlineKeyboardManager'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'
import StringUtils from '../../../../utils/StringUtils'
import ContextUtils from '../../../../utils/ContextUtils'
import BuckwheatCommandWithSub from '../../base/BuckwheatCommandWithSub'

type RuleSubCommand = {
    needData: boolean
    needAdmin: boolean
    execute: (options: BuckwheatCommandOptions & { data: string }) => Promise<boolean>
    sendMessage: (options: { ctx: TextContext, changeValues: Record<string, any> }) => Promise<void>
    title: string,
    description: string
} & SubCommandObject

export default class RuleCommand extends BuckwheatCommandWithSub<RuleSubCommand> {
    protected _settingId: string = 'rule'

    constructor () {
        super(
            [
                {
                    title: 'Для удаления правила',
                    description: 'баквит правила удалить <1-9999>\n(возможно, вы ввели неверный номер)',
                    name: 'удалить',

                    needData: true,
                    needAdmin: true,

                    settingId: 'deleteRule',
                    minimumRank: RankUtils.admin,

                    execute: async ({ data, chatId }) => {
                        return await this._deleteRule(chatId, data)
                    },
                    sendMessage: async ({ ctx, changeValues }) => {
                        await MessageUtils.answerMessageFromResource(
                            ctx,
                            'text/commands/rules/done/delete.pug',
                            {
                                changeValues: {
                                    number: +changeValues.data
                                }
                            }
                        )
                    }
                },

                {
                    title: 'Для добавление нового правила',
                    description: 'баквит правила добавить <текст>',
                    name: 'добавить',

                    needAdmin: true,
                    needData: true,

                    settingId: 'addRule',
                    minimumRank: RankUtils.admin,

                    execute: async ({ data, chatId }) => {
                        return await this._addRule(chatId, data)
                    },
                    sendMessage: async ({ ctx }) => {
                        await MessageUtils.answerMessageFromResource(
                            ctx,
                            'text/commands/rules/done/add.pug'
                        )
                    }
                },

                {
                    title: 'Для дополнения старого правила',
                    description: 'баквит правила дополнить <номер правила> <текст>',
                    name: 'дополнить',

                    needAdmin: true,
                    needData: true,

                    settingId: 'extendRule',
                    minimumRank: RankUtils.admin,

                    execute: async (options) => {
                        const {
                            chatId,
                            data,
                            id
                        } = options

                        const { name } = await ContextUtils.getUser(chatId, id)

                        return await this._extendRule(name, chatId, data)
                    },

                    sendMessage: async ({ ctx, changeValues }) => {
                        await MessageUtils.answerMessageFromResource(
                            ctx,
                            'text/commands/rules/done/extend.pug',
                            {
                                changeValues: {
                                    number: +changeValues.data.split(' ', 1)[0]
                                }
                            }
                        )
                    }
                }
            ]
        )

        this._name = 'правила'
        this._description = 'показываю или редактирую правила'
        this._aliases = [
            'правило',
        ]
    }

    protected async _checkAccess(options: BuckwheatCommandOptions, subCommand: [RuleSubCommand, string]): Promise<boolean> {
        const { ctx } = options

        const [
            {
                needData,
                title,
                description,
            },
            data
        ] = subCommand

        const hasData = Boolean(data)
        const changeValues = {
            title,
            description
        }

        if (needData && !hasData) {
            await this._sendHelpSubCommandMessage(
                ctx,
                changeValues
            )
            return false
        }

        return true
    }

    protected async _handleNoText(options: BuckwheatCommandOptions): Promise<void> {
        const {
            chatId,
            ctx
        } = options

        const rules = await RulesService.get(chatId)

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/rules/start.pug',
            {
                inlineKeyboard: await LegacyInlineKeyboardManager.get('rules', '-1'),
                changeValues: {
                    count: rules.length
                }
            }
        )
    }

    protected async _handleNotExistCommand(options: BuckwheatCommandOptions): Promise<void> {
        const {
            ctx
        } = options
        await this._sendHelpMessage(ctx)
    }

    protected async _handleWrongDataCommand(options: BuckwheatCommandOptions, sub: RuleSubCommand): Promise<void> {
        const {
            ctx
        } = options

        await this._sendHelpSubCommandMessage(
            ctx,
            sub
        )
    }

    protected async _handleCommand(options: BuckwheatCommandOptions, subCommand: [RuleSubCommand, string]): Promise<void> {
        const {
            ctx,
            chatId,
        } = options
        const [
            sub,
            data
        ] = subCommand

        const rules = await RulesService.get(chatId)
        await sub.sendMessage({ ctx, changeValues: { rules, data } })
    }

    private async _sendHelpMessage(ctx: TextContext): Promise<void> {
        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/rules/help.pug',
            { changeValues: { subCommands: this._subCommands } }
        )
    }

    private async _sendHelpSubCommandMessage(ctx: TextContext, changeValues: Record<string, any>) {
        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/rules/sub-command-help.pug',
            {
                changeValues
            }
        )
    }

    private async _deleteRule(id: number, data: string): Promise<boolean> {
        if (isNaN(+data)) {
            return false
        }

        const index = Math.floor(+data - 1)
        const rules = await RulesService.get(id)

        await RulesService.delete(id, index)
        return index >= 0 && index < rules.length
    }

    private async _addRule(id: number, data: string): Promise<boolean> {
        await RulesService.add(id, data)
        return true
    }

    private async _extendRule(name: string, chatId: number, data: string): Promise<boolean> {
        const [rawIndex, text] = StringUtils.splitByCommands(data, 1)

        if (isNaN(+rawIndex)) {
            return false
        }

        const index = +rawIndex - 1
        return await RulesService.extend(
            chatId,
            index,
            `Дополнение от ${name}: ${text}`
        )
    }
}