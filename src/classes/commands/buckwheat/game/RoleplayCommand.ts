import MessageUtils from '../../../../utils/MessageUtils'
import StringUtils from '../../../../utils/StringUtils'
import SubCommandUtils from '../../../../utils/SubCommandUtils'
import { FIRST_INDEX } from '../../../../utils/values/consts'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'
import { MaybeString, SubCommandObject } from '../../../../utils/values/types/types'
import { TextContext } from '../../../../utils/values/types/contexts'
import LinkedChatService from '../../../db/services/linkedChat/LinkedChatService'
import RoleplaysService from '../../../db/services/rp/RoleplaysService'
import UserRankService from '../../../db/services/user/UserRankService'
import InlineKeyboardManager from '../../../main/InlineKeyboardManager'
import BuckwheatCommand from '../../base/BuckwheatCommand'

type SubCommand = SubCommandObject & {
    execute: (options: BuckwheatCommandOptions) => Promise<boolean>
    minimumRank?: number
    needData?: boolean,
    exampleData?: string
}

export default class RoleplayCommand extends BuckwheatCommand {
    private _subCommands: SubCommand[] = [
        {
            name: 'список',
            execute: async ({ ctx, chatId }) => {
                await MessageUtils.answerMessageFromResource(
                    ctx,
                    'text/commands/add-rp/start-list.pug',
                    {
                        changeValues: {
                            length: (await RoleplaysService.getCommands(chatId)).length
                        },
                        inlineKeyboard: await InlineKeyboardManager.get('start-roleplaychange')
                    }
                )
                return true
            },
        },

        {
            name: 'добавить',
            execute: async ({ ctx, other }) => {
                if (!other) return false

                const [rawName, text] = StringUtils.splitByCommands(other, 1)
                if (!text) return false
                const name = rawName.toLowerCase()

                const chatId = await LinkedChatService.getCurrent(ctx)
                if (!chatId) return false

                if (await RoleplaysService.set(chatId, name, text)) {
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
            execute: async ({ ctx, other, chatId }) => {
                if (!other) return false

                const [name] = other.split(StringUtils.spaceRegexp, 1)

                if (await RoleplaysService.delete(chatId, name)) {
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
                        'text/commands/add-rp/not-exist.pug',
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

    constructor () {
        super()
        this._name = 'рп'
        this._description = 'обновляю или показываю доступные кастомные рп команды'
        this._needData = true
        this._argumentText = `(${SubCommandUtils.getArgumentText(this._subCommands)}) [данные]`
    }

    async execute(options: BuckwheatCommandOptions): Promise<void> {
        const { ctx, other, chatId, id } = options
        const rank = await UserRankService.get(chatId, id)

        const [subCommand, text] = SubCommandUtils.getSubCommandAndData(other, this._subCommands)
        const {
            name,
            minimumRank,
            execute,
            needData,
            exampleData,
        } = typeof subCommand == 'string' ? this._subCommands[FIRST_INDEX] : subCommand

        if (minimumRank! > rank) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/add-rp/rank-issue.pug'
            )
            return
        }

        if (!text && needData || !(await execute({
            ...options,
            other: text as string
        }))) {
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