import { CHAT_ID } from '../../../../utils/values/consts'
import ChatRepository from '../../repositories/ChatRepository'
import ChatService from './ChatService'

export default class PremiumChatService {
    static async get(chatId: number): Promise<boolean> {
        if(chatId == CHAT_ID) return true

        const chat = await ChatService.get(chatId)
        return (chat?.premiumUntilDate ?? 0) >= Date.now()
    }

    static async set(chatId: number, ms: number): Promise<void> {
        await ChatRepository.updateOne(chatId, {premiumUntilDate: ms})
    }
}