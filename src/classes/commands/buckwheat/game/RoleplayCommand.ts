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
import BuckwheatCommandWithSub from '../../base/BuckwheatCommandWithSub'
import RankUtils from '../../../../utils/RankUtils'

type SubCommand = SubCommandObject & {
    execute: (options: BuckwheatCommandOptions & { data: string }) => Promise<boolean>
    minimumRank?: number
    needData?: boolean,
    exampleData?: string
}

export default class RoleplayCommand extends BuckwheatCommandWithSub<SubCommand> {
    constructor () {
        super(
            [
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
                    execute: async ({ ctx, data: other }) => {
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
                    execute: async ({ ctx, data: other, chatId }) => {
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
        )

        this._name = 'рп'
        this._description = 'обновляю или показываю доступные кастомные рп команды'
    }

    protected async _checkAccess(options: BuckwheatCommandOptions, [sub]: [SubCommand, string]): Promise<boolean> {
        const {
            ctx,
            chatId,
            id
        } = options

        const minimumRank = sub.minimumRank ?? RankUtils.min
        const rank = await UserRankService.get(chatId, id)

        if (minimumRank! > rank) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/add-rp/rank-issue.pug'
            )
            return false
        }

        return true
    }

    protected async _handleNoText(options: BuckwheatCommandOptions): Promise<void> {
        await this._handleNoSubCommand(options)
    }

    protected async _handleNotExistCommand(options: BuckwheatCommandOptions): Promise<void> {
        await this._handleNoSubCommand(options)
    }

    protected async _handleWrongDataCommand(options: BuckwheatCommandOptions, sub: SubCommand): Promise<void> {
        const {
            name,
            exampleData
        } = sub

        const {
            ctx
        } = options

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
    }

    protected async _handleCommand(_options: BuckwheatCommandOptions, _: [SubCommand, string]): Promise<void> {
        return
    }

    private async _handleNoSubCommand(options: BuckwheatCommandOptions) {
        await this._execute(
            options,
            [
                this._subCommands[FIRST_INDEX],
                ''
            ]
        )
    }
}