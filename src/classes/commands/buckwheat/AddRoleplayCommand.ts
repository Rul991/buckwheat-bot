import MessageUtils from '../../../utils/MessageUtils'
import RoleplayUtils from '../../../utils/RoleplayUtils'
import StringUtils from '../../../utils/StringUtils'
import SubCommandUtils from '../../../utils/SubCommandUtils'
import { TextContext, MaybeString, NameObject } from '../../../utils/values/types'
import RoleplaysService from '../../db/services/rp/RoleplaysService'
import UserRankService from '../../db/services/user/UserRankService'
import BuckwheatCommand from '../base/BuckwheatCommand'

type SubCommand = NameObject & {
    execute: (ctx: TextContext, text: MaybeString) => Promise<boolean>
    minimumRank?: number
    needData?: boolean,
    exampleData?: string
}

export default class AddRoleplayCommand extends BuckwheatCommand {
    private _subCommands: SubCommand[] = [
        {
            name: 'список',
            execute: async ctx => {
                await MessageUtils.answerMessageFromResource(
                    ctx,
                    'text/commands/add-rp/list.pug',
                    {
                        changeValues: {
                            commands: await RoleplaysService.getCommands(ctx.chat.id)
                        }
                    }
                )
                return true
            },
        },

        {
            name: 'добавить',
            execute: async (ctx, other) => {
                if(!other) return false

                const [name, text] = StringUtils.splitByCommands(other, 1)
                if(!text) return false

                if(await RoleplaysService.set(ctx.chat.id, name, text)) {
                    await MessageUtils.answerMessageFromResource(
                        ctx,
                        'text/commands/add-rp/done.pug',
                        {
                            changeValues: {
                                name,
                                act: 'добавлена'
                            }
                        }
                    )
                }
                else {
                    await MessageUtils.answerMessageFromResource(
                        ctx,
                        'text/commands/add-rp/exist.pug',
                        {
                            changeValues: {
                                name
                            }
                        }
                    )
                }

                return true
            },
            minimumRank: 1,
            needData: true,
            exampleData: 'накричать накричал на'
        },

        {
            name: 'удалить',
            execute: async (ctx, other) => {
                if(!other) return false

                const [name] = other.split(StringUtils.spaceRegexp, 1)

                if(await RoleplaysService.delete(ctx.chat.id, name)) {
                    await MessageUtils.answerMessageFromResource(
                        ctx,
                        'text/commands/add-rp/done.pug',
                        {
                            changeValues: {
                                name,
                                act: 'удалена'
                            }
                        }
                    )
                }
                else {
                    await MessageUtils.answerMessageFromResource(
                        ctx,
                        'text/commands/add-rp/exist.pug',
                        {
                            changeValues: {
                                name
                            }
                        }
                    )
                }

                return true
            },
            minimumRank: 1,
            needData: true,
            exampleData: 'накричать',
        }
    ]

    constructor() {
        super()
        this._name = 'рп'
        this._description = 'обновляю или показываю доступные кастомные рп команды'
        this._needData = true
        this._argumentText = `(${SubCommandUtils.getArgumentText(this._subCommands)}) [данные]`
    }

    async execute(ctx: TextContext, other: MaybeString): Promise<void> {
        const rank = await UserRankService.get(ctx.from.id)

        const [subCommand, text] = SubCommandUtils.getSubCommandAndData(other, this._subCommands)
        const {
            name, 
            minimumRank, 
            execute, 
            needData, 
            exampleData, 
        } = typeof subCommand == 'string' ? this._subCommands[0] : subCommand

        if(minimumRank! > rank) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/add-rp/rank-issue.pug'
            )
            return
        }

        if(!text && needData || !(await execute(ctx, text as string))) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/add-rp/wrong-command.pug',
                {
                    changeValues: {
                        name,
                        example: exampleData
                    }
                }
            )
            return
        }
    }
}