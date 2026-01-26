import { Context } from 'telegraf'
import LinkedChat from '../../../../interfaces/schemas/user/LinkedChat'
import LinkedChatRepository from '../../repositories/LinkedChatRepository'

export default class LinkedChatService {
    static async create(id: number): Promise<LinkedChat> {
        const found = await LinkedChatRepository.findOne(id)
        if(!found) return LinkedChatRepository.create({id})
        else return found
    }

    static async set(id: number, chat: number): Promise<number> {
        await LinkedChatRepository.updateOne(id, {linkedChat: chat})
        return chat
    }

    static async getRaw(id: number): Promise<number> {
        return (await this.create(id)).linkedChat ?? 0
    }

    static async getCurrent(ctx: Context, userId?: number): Promise<number | null> {
        if(!ctx.chat?.id) return null
        if(ctx.chat.type != 'private') return ctx.chat.id
        if(!(ctx.from?.id || userId)) return null

        const usedId = (userId ?? ctx.from?.id)!
        const linkedChat = await this.getRaw(usedId)

        return linkedChat == 0 ? null : linkedChat
    }

    static async getAll(): Promise<LinkedChat[]> {
        return await LinkedChatRepository.findMany()
    }
}