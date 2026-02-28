import ContextUtils from '../../../utils/ContextUtils'
import MessageUtils from '../../../utils/MessageUtils'
import { ALWAYS_JOIN_SYMBOL, MESSAGE_JOIN_SYMBOL } from '../../../utils/values/consts'
import { ChatJoinRequestOptions } from '../../../utils/values/types/action-options'
import ChatSettingsService from '../../db/services/settings/ChatSettingsService'
import InlineKeyboardManager from '../../main/InlineKeyboardManager'
import ChatJoinRequestAction from './ChatJoinRequestAction'

export default class extends ChatJoinRequestAction {
    private _chatJoinActions: Record<string, (options: ChatJoinRequestOptions) => Promise<void>> = {
        [ALWAYS_JOIN_SYMBOL]: async options => {
            const {
                ctx,
                id
            } = options

            await ContextUtils.approveChatJoinRequest(ctx, id)
        },
        [MESSAGE_JOIN_SYMBOL]: async options => {
            const {
                chatId,
                id,
                ctx
            } = options
            const bio = ctx.chatJoinRequest.bio

            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/join/add-member.pug',
                {
                    changeValues: {
                        user: await ContextUtils.getUser(chatId, id),
                        bio
                    },
                    inlineKeyboard: await InlineKeyboardManager.get(
                        'join/set',
                        {
                            globals: {
                                id
                            }
                        }
                    )
                }
            )
        }
    }

    async execute(options: ChatJoinRequestOptions): Promise<void> {
        const {
            chatId
        } = options

        const chatJoinSymbols = await ChatSettingsService.get(
            chatId,
            'autoJoin'
        )

        const action = this._chatJoinActions[chatJoinSymbols]
        if (!action) return

        await action(options)
    }
}