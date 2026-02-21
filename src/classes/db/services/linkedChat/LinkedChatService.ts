import { Context } from 'telegraf'
import LinkedChat from '../../../../interfaces/schemas/user/LinkedChat'
import LinkedChatRepository from '../../repositories/LinkedChatRepository'
import { LINKED_CHATS_MAX_COUNT } from '../../../../utils/values/consts'

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
        const linkedChat = await this.create(id)
        return linkedChat.linkedChats ?? []
    }

    static async getAll(): Promise<LinkedChat[]> {
        return await LinkedChatRepository.findMany({
            linkedChat: { $ne: 0, $exists: true }
        })
    }
}