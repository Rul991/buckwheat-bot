import Chat from '../../../../interfaces/schemas/chat/Chat'
import PremiumUtils from '../../../../utils/PremiumUtils'
import ChatRepository from '../../repositories/ChatRepository'

type SetData = Required<Omit<Chat, 'id' | 'premiumUntilDate'>>

type Stats = {
    total: number
    premiums: number
}

export default class ChatService {
    static async get(chatId: number): Promise<Chat> {
        const chat = await ChatRepository.findOne(chatId)

        if (chat) return chat
        else return await ChatRepository.create({ id: chatId })
    }

    static async getAll(): Promise<Chat[]> {
        return await ChatRepository.findMany()
    }

    static async getStats(): Promise<Stats> {
        const chats = await this.getAll()
        const total = chats.length

        let premiums = 0

        for (const chat of chats) {
            if(PremiumUtils.isPremium(chat)) {
                premiums++
            }
        }

        return {
            total,
            premiums
        }
    }

    static async delete(chatId: number) {
        return await ChatRepository.deleteOne(chatId)
    }

    static async set(chatId: number, data: SetData) {
        return await ChatRepository.updateOne(
            chatId,
            data
        )
    }
}