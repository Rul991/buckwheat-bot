import { SubCommandObject } from '../../../../utils/values/types/types'
import { TextContext } from '../../../../utils/values/types/contexts'
import BuckwheatCommand from '../../base/BuckwheatCommand'
import MessageUtils from '../../../../utils/MessageUtils'
import UserRankService from '../../../db/services/user/UserRankService'
import RankUtils from '../../../../utils/RankUtils'
import RulesService from '../../../db/services/chat/RulesService'
import SubCommandUtils from '../../../../utils/SubCommandUtils'
import InlineKeyboardManager from '../../../main/InlineKeyboardManager'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'
import StringUtils from '../../../../utils/StringUtils'
import ContextUtils from '../../../../utils/ContextUtils'

type RuleSubCommand = {
    needData: boolean
    needAdmin: boolean
    execute: (options: BuckwheatCommandOptions & { other: string }) => Promise<boolean>
    sendMessage: (options: { ctx: TextContext, changeValues: Record<string, any> }) => Promise<void>
    title: string,
    description: string
} & SubCommandObject

export default class RuleCommand extends BuckwheatCommand {
    private _subCommands: RuleSubCommand[] = [
        {
            title: 'Для удаления правила',
            description: 'баквит правила удалить <1-9999>\n(возможно, вы ввели неверный номер)',
            name: 'удалить',

            needData: true,
            needAdmin: true,

            execute: async ({ other: data, chatId }) => {
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

            execute: async ({ other: data, chatId }) => {
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

            execute: async (options) => {
                const {
                    chatId,
                    other,
                    id
                } = options

                const {name} = await ContextUtils.getUser(chatId, id)
                
                return await this._extend(name, chatId, other)
            },

            sendMessage: async ({ctx, changeValues}) => {
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

    constructor () {
        super()
        this._name = 'правила'
        this._description = 'показываю или редактирую правила'
        this._needData = true
        this._aliases = [
            'правило',
        ]

        const commands = SubCommandUtils.getArgumentText(this._subCommands)
        this._argumentText = `(${commands}) [аргументы]`
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

    private async _extend(name: string, chatId: number, data: string): Promise<boolean> {
        const [rawIndex, text] = StringUtils.splitByCommands(data, 1)
        
        if(isNaN(+rawIndex)) {
            return false
        }

        const index = +rawIndex - 1
        return await RulesService.extend(
            chatId,
            index,
            `Дополнение от ${name}: ${text}`
        )
    }

    async execute(options: BuckwheatCommandOptions): Promise<void> {
        const { ctx, other, id, chatId } = options
        const commandAndData = SubCommandUtils.getSubCommandAndData(
            other,
            this._subCommands
        )

        if (commandAndData == 'no-text') {
            const rules = await RulesService.get(chatId)

            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/rules/start.pug',
                {
                    inlineKeyboard: await InlineKeyboardManager.get('rules', '-1'),
                    changeValues: {
                        count: rules.length
                    }
                }
            )
        }
        else if (commandAndData === 'not-exist') {
            this._sendHelpMessage(ctx)
        }
        else {
            const rank = await UserRankService.get(chatId, id)
            const isAdminRank = RankUtils.canUse({
                userRank: rank,
                id
            })
            const rules = await RulesService.get(chatId)

            const [
                {
                    needAdmin,
                    needData,
                    execute,
                    sendMessage,
                    title,
                    description
                },
                data
            ] = commandAndData

            const hasData = Boolean(data)

            const changeValues = {
                title,
                description
            }

            if (needAdmin && !isAdminRank) {
                await MessageUtils.answerMessageFromResource(
                    ctx,
                    'text/commands/rules/noAdmin.pug'
                )
                return
            }

            if (needData && !hasData) {
                await this._sendHelpSubCommandMessage(
                    ctx,
                    changeValues
                )
                return
            }

            const isExecuted = await execute({
                ...options,
                other: data,
            })
            if (isExecuted) {
                await sendMessage({ ctx, changeValues: { rules, data } })
            }
            else {
                await this._sendHelpSubCommandMessage(
                    ctx,
                    changeValues
                )
            }

            return
        }
    }
}