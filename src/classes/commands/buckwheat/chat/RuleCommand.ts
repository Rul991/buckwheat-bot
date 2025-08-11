import { Context } from 'telegraf'
import { MaybeString, TextContext } from '../../../../utils/types'
import BuckwheatCommand from '../../base/BuckwheatCommand'
import MessageUtils from '../../../../utils/MessageUtils'
import UserRankService from '../../../db/services/user/UserRankService'
import RankUtils from '../../../../utils/RankUtils'
import RulesService from '../../../db/services/chat/RulesService'
import { TAB_NEW_LINE } from '../../../../utils/consts'

type RuleSubCommand = {
    needData: boolean
    needAdmin: boolean
    name: string
    execute: (data: string) => Promise<boolean>
    sendMessage: (options: {ctx: Context, changeValues: Record<string, any>}) => Promise<void>
    title: string,
    description: string
}

export default class RuleCommand extends BuckwheatCommand {
    private _subCommands: RuleSubCommand[] = [
        {
            title: 'Для удаления правила',
            description: 'баквит правила удалить <1-9999>\n(возможно, вы ввели неверный номер)',
            name: 'удалить',

            needData: true,
            needAdmin: true,

            execute: async data => {
                return await this._deleteRule(data)
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

            execute: async data => {
                return await this._addRule(data)
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

        const commands = this._subCommands
            .reduce((prev, curr, i) => 
                `${prev}${curr.name}${i < this._subCommands.length - 1 ? ' | ' : ''}`, 
            ''
        )
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
                changeValues,
                isParseToHtmlEntities: false
            }
        )
    }

    private async _deleteRule(data: string): Promise<boolean> {
        if(isNaN(+data)) {
            return false
        }

        const index = +data - 1
        const rules = await RulesService.get()

        await RulesService.delete(index)
        return index >= 0 && index < rules.length
    }

    private async _addRule(data: string): Promise<boolean> {
        await RulesService.add(data)
        return true
    }

    async execute(ctx: TextContext, other: MaybeString): Promise<void> {
        const id = ctx.from?.id ?? 0

        if(!other) {
            const rules = await RulesService.get()
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
        else {
            const rank = await UserRankService.get(id)
            const [command, ...nonSplittedData] = other.split(' ')
            const data = nonSplittedData
                .join(' ')
                .replaceAll('%', TAB_NEW_LINE)
            const rules = await RulesService.get()

            const isAdminRank = rank >= RankUtils.adminRank
            const hasData = Boolean(data)

            for(const {
                name, 
                needAdmin, 
                needData, 
                execute, 
                sendMessage, 
                title, 
                description
            } of this._subCommands) {
                if(command == name) {
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

                    const isExecuted = await execute(data)
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

            this._sendHelpMessage(ctx)
        }
    }
}