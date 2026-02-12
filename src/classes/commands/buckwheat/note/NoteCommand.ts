import ContextUtils from '../../../../utils/ContextUtils'
import FileUtils from '../../../../utils/FileUtils'
import MessageUtils from '../../../../utils/MessageUtils'
import RankUtils from '../../../../utils/RankUtils'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'
import { FullSubCommandObject } from '../../../../utils/values/types/types'
import NoteService from '../../../db/services/notes/NoteService'
import InlineKeyboardManager from '../../../main/InlineKeyboardManager'
import BuckwheatCommandWithSub from '../../base/BuckwheatCommandWithSub'

type Sub = FullSubCommandObject & {
    sendMessage: Sub['execute']
    wrongDataMessage: (options: BuckwheatCommandOptions) => Promise<string>
}

export default class extends BuckwheatCommandWithSub<Sub> {
    protected _settingId: string = 'note'

    constructor() {
        super([
            {
                name: 'добавить',
                settingId: 'addNote',
                minimumRank: RankUtils.min,
                needData: true,
                execute: async options => {
                    const {
                        id,
                        data
                    } = options
                    
                    const text = await NoteService.add(
                        id,
                        data
                    )

                    return true
                },
                sendMessage: async options => {
                    const {
                        ctx
                    } = options

                    await MessageUtils.answerMessageFromResource(
                        ctx,
                        'text/commands/notes/add.pug'
                    )

                    return true
                },
                wrongDataMessage: async _options => {
                    return await FileUtils.readPugFromResource(
                        'text/commands/notes/wrong/add.pug'
                    )
                }
            }
        ])

        this._name = 'заметки'
        this._description = 'показываю заметки'
        this._aliases = [
            'заметка'
        ]
        this._replySupport = true
    }

    protected async _handleNoText(options: BuckwheatCommandOptions): Promise<void> {
        const {
            ctx,
            chatId,
            replyOrUserFrom,
            replyFrom,
            id: userId
        } = options

        const isReply = replyOrUserFrom == replyFrom
        const id = replyOrUserFrom.id

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/notes/change.pug',
            {
                changeValues: {
                    user: await ContextUtils.getUser(chatId, id)
                },
                inlineKeyboard: await InlineKeyboardManager.get(
                    'notes/start',
                    {
                        globals: {
                            userId,
                            isPublic: isReply || undefined,
                            replyOrUserId: id
                        }
                    }
                )
            }
        )
    }

    protected async _handleNotExistCommand(options: BuckwheatCommandOptions): Promise<void> {
        await this._handleNoText(options)
    }

    protected async _handleWrongDataCommand(options: BuckwheatCommandOptions, sub: Sub): Promise<void> {
        const {
            ctx
        } = options
        const text = await sub.wrongDataMessage(options)

        await MessageUtils.answer(
            ctx,
            text
        )
    }

    protected async _handleCommand(options: BuckwheatCommandOptions, [sub, data]: [Sub, string]): Promise<void> {
        const fullOptions = {
            ...options,
            data
        }

        await sub.sendMessage(fullOptions)
    }
}