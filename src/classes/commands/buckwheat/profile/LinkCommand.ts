import MessageUtils from '../../../../utils/MessageUtils'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'
import { MaybeString } from '../../../../utils/values/types/types'
import { TextContext } from '../../../../utils/values/types/contexts'
import LinkedChatService from '../../../db/services/linkedChat/LinkedChatService'
import BuckwheatCommand from '../../base/BuckwheatCommand'
import InlineKeyboardManager from '../../../main/InlineKeyboardManager'
import ChatService from '../../../db/services/chat/ChatService'

export default class LinkCommand extends BuckwheatCommand {
    protected _settingId: string = 'link'

    constructor () {
        super()
        this._name = 'привязать'
        this._description = 'привязываю вас к этому чату\nпозволяю работать с собой в личных сообщениях'
    }

    async execute({ ctx, id, chatId }: BuckwheatCommandOptions): Promise<void> {
        if (ctx.chat.type == 'private') {
            const linkedChats = await LinkedChatService.getLinkedChats(id)
            if (!linkedChats.length) {
                await MessageUtils.answerMessageFromResource(
                    ctx,
                    'text/commands/link/no-chats.pug'
                )
                return
            }

            const chats = await ChatService.getChatsByIds(linkedChats)
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/link/list.pug',
                {
                    inlineKeyboard: await InlineKeyboardManager.get(
                        'linked/list',
                        {
                            values: {
                                chat: chats.map((chat) => {
                                    const {
                                        id,
                                        name = id.toString()
                                    } = chat

                                    return {
                                        text: `${name}`,
                                        data: {
                                            chat: id
                                        }
                                    }
                                })
                            }
                        }
                    )
                }
            )
            return
        }

        if (chatId == await LinkedChatService.getRaw(id)) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/link/already.pug'
            )
            return
        }

        await LinkedChatService.set(id, chatId)
        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/link/done.pug',
            {
                changeValues: {
                    title: ctx.chat.title
                }
            }
        )
    }
}