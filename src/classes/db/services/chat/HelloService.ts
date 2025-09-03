import ChatRepository from '../../repositories/ChatRepository'
import ChatService from './ChatService'

export default class HelloService {
    static async get(chatId: number): Promise<string> {
        return (await ChatService.create(chatId))?.hello ?? ''
    }

    static async edit(chatId: number, hello: string): Promise<void> {
        await this.get(chatId)
        await ChatRepository.updateOne(chatId, {hello})
    }
}