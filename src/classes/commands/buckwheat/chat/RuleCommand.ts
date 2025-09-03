import { MaybeString, NameObject, TextContext } from '../../../../utils/values/types'
import BuckwheatCommand from '../../base/BuckwheatCommand'
import MessageUtils from '../../../../utils/MessageUtils'
import UserRankService from '../../../db/services/user/UserRankService'
import RankUtils from '../../../../utils/RankUtils'
import RulesService from '../../../db/services/chat/RulesService'
import SubCommandUtils from '../../../../utils/SubCommandUtils'
import LinkedChatService from '../../../db/services/linkedChat/LinkedChatService'

type RuleSubCommand = {
    needData: boolean
    needAdmin: boolean
    execute: (ctx: TextContext, data: string) => Promise<boolean>
    sendMessage: (options: {ctx: TextContext, changeValues: Record<string, any>}) => Promise<void>
    title: string,
    description: string
} & NameObject

export default class RuleCommand extends BuckwheatCommand {
    private _subCommands: RuleSubCommand[] = [
        {
            title: 'Для удаления правила',
            description: 'баквит правила удалить <1-9999>\n(возможно, вы ввели неверный номер)',
            name: 'удалить',

            needData: true,
            needAdmin: true,

            execute: async (ctx, data) => {
                const chatId = await LinkedChatService.getChatId(ctx)
                if(!chatId) return false
                return await this._deleteRule(ctx.chat.id, data)
            },
            sendMessage: async ({ctx, changeValues}) => {
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
            description: 'баквит правила добавить <текст>\n(для того, чтобы ввести текст в несколько строк, вводи через %)',
            name: 'добавить',

            needAdmin: true,
            needData: true,

            execute: async (ctx, data) => {
                const chatId = await LinkedChatService.getChatId(ctx)
                if(!chatId) return false
                return await this._addRule(chatId, data)
            },
            sendMessage: async ({ctx}) => {
                await MessageUtils.answerMessageFromResource(
                    ctx,
                    'text/commands/rules/done/add.pug'
                )
            }
        },

        {
            title: 'Для вызова списка',
            description: 'баквит правила список',
            name: 'список',

            needData: false,
            needAdmin: false,

            execute: async _ => {
                return true
            },
            sendMessage: async ({ctx, changeValues}) => {
                await MessageUtils.answerMessageFromResource(
                    ctx,
                    'text/commands/rules/list.pug',
                    { changeValues }
                )
            }
        }
    ]

    constructor() {
        super()
        this._name = 'правила'
        this._description = 'показываю или редактирую правила'
        this._needData = true

        const commands = SubCommandUtils.getArgumentText(this._subCommands)
        this._argumentText = `(${commands}) [аргументы]`
    }

    private async _sendHelpMessage(ctx: TextContext): Promise<void> {
        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/rules/help.pug',
            {changeValues: {subCommands: this._subCommands}}
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
        if(isNaN(+data)) {
            return false
        }

        const index = +data - 1
        const rules = await RulesService.get(id)

        await RulesService.delete(id, index)
        return index >= 0 && index < rules.length
    }

    private async _addRule(id: number, data: string): Promise<boolean> {
        await RulesService.add(id, data)
        return true
    }

    async execute(ctx: TextContext, other: MaybeString): Promise<void> {
        const id = ctx.from.id
        const chatId = await LinkedChatService.getChatId(ctx)
        if(!chatId) return
        const commandAndData = SubCommandUtils.getSubCommandAndData(
            other, 
            this._subCommands
        )

        if(commandAndData == 'no-text') {
            const rules = await RulesService.get(chatId)

            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/rules/start.pug',
                {
                    inlineKeyboard: ['rules', '-1'],
                    changeValues: {
                        count: rules.length
                    }
                }
            )
        }
        else if(commandAndData === 'not-exist') {
            this._sendHelpMessage(ctx)
        }
        else {
            const rank = await UserRankService.get(chatId, id)
            const isAdminRank = rank >= RankUtils.admin
            const rules = await RulesService.get(chatId)

            const [
                {
                    name, 
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

            if(needAdmin && !isAdminRank) {
                await MessageUtils.answerMessageFromResource(
                    ctx,
                    'text/commands/rules/noAdmin.pug'
                )
                return
            }

            if(needData && !hasData) {
                await this._sendHelpSubCommandMessage(
                    ctx,
                    changeValues
                )
                return
            }

            const isExecuted = await execute(ctx, data)
            if(isExecuted) {
                await sendMessage({ctx, changeValues: {rules, data}})
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