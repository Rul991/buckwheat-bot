import Chat from '../../../../interfaces/schemas/chat/Chat'
import ChatRepository from '../../repositories/ChatRepository'

export default class ChatService {
    static async get(chatId: number): Promise<Chat> {
        const chat = await ChatRepository.findOne(chatId)
        
        if(chat) return chat
        else return await ChatRepository.create({id: chatId})
    }

    static async getAll(): Promise<Chat[]> {
        return await ChatRepository.findMany()
    }
}