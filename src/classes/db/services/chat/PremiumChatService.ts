import { CHAT_ID } from '../../../../utils/values/consts'
import ChatRepository from '../../repositories/ChatRepository'
import ChatService from './ChatService'

export default class PremiumChatService {
    static async isPremium(chatId: number): Promise<boolean> {
        if(chatId == CHAT_ID) return true

        const untilDate = await this.get(chatId)
        return untilDate >= Date.now()
    }

    static async getUntilDate(chatId: number): Promise<number> {
        if(chatId == CHAT_ID) return 0
        return await this.get(chatId) - Date.now()
    }

    static async get(chatId: number): Promise<number> {
        const chat = await ChatService.get(chatId)
        return chat?.premiumUntilDate ?? 0
    }

    static async set(chatId: number, ms: number): Promise<number> {
        await ChatRepository.updateOne(chatId, {premiumUntilDate: ms})
        return ms
    }

    static async add(chatId: number, ms: number): Promise<number> {
        const untilDate = await this.get(chatId)
        const currentTime = Math.max(Date.now(), untilDate)
        const newTime = currentTime + ms

        return await this.set(chatId, newTime)
    }
}