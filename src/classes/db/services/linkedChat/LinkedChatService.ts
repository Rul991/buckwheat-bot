import { Context } from 'telegraf'
import LinkedChat from '../../../../interfaces/schemas/user/LinkedChat'
import LinkedChatRepository from '../../repositories/LinkedChatRepository'
import MessageUtils from '../../../../utils/MessageUtils'
import InlineKeyboardManager from '../../../main/InlineKeyboardManager'
import ChatService from '../chat/ChatService'

export default class LinkedChatService {
    static async create(id: number): Promise<LinkedChat> {
        const found = await LinkedChatRepository.findOne(id)
        if (!found) return LinkedChatRepository.create({ id })
        else return found
    }

    static async set(id: number, chat: number): Promise<number> {
        await LinkedChatRepository.updateOne(
            id,
            {
                linkedChat: chat,
                $addToSet: {
                    linkedChats: chat
                }
            }
        )
        return chat
    }

    static async remove(id: number, chat: number) {
        return await LinkedChatRepository.updateOne(
            id,
            {
                linkedChat: 0,
                $pull: {
                    linkedChats: chat
                }
            }
        )
    }

    static async getRaw(id: number): Promise<number> {
        return (await this.create(id)).linkedChat ?? 0
    }

    static async getCurrent(ctx: Context, userId?: number): Promise<number | null> {
        if (!ctx.chat?.id) return null
        if (ctx.chat.type != 'private') return ctx.chat.id
        if (!(ctx.from?.id || userId)) return null

        const usedId = (userId ?? ctx.from?.id)!
        const linkedChat = await this.getRaw(usedId)

        return linkedChat == 0 ? null : linkedChat
    }

    static async getLinkedChats(id: number) {
        const chat = await LinkedChatService.create(id)
        const linkedChats = chat.linkedChats ?? []
        const linkedChat = chat.linkedChat

        if(linkedChat && linkedChats.some(v => v != linkedChat)) {
            linkedChats.unshift(linkedChat)
        }

        return linkedChats
    }

    static async getAll(): Promise<LinkedChat[]> {
        return await LinkedChatRepository.findMany({
            linkedChat: { $ne: 0, $exists: true }
        })
    }

    static async sendMessage(ctx: Context, id: number) {
        const linkedChats = await this.getLinkedChats(id)

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
    }
}