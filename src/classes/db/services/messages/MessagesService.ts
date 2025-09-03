import Messages from '../../../../interfaces/schemas/Messages'
import MessagesRepository from '../../repositories/MessagesRepository'

export default class MessagesService {
    static async get(chatId: number, id: number): Promise<Messages> {
        const messages = await MessagesRepository.findOne(chatId, id)

        if(messages) return messages
        else return await MessagesRepository.create({chatId, id, firstMessage: Date.now()})
    }

    static async getAll(chatId: number): Promise<Messages[]> {
        return await MessagesRepository.findManyInChat(chatId)
    }

    static async add(chatId: number, id: number, addValue = 1): Promise<number> {
        const messages = await this.get(chatId, id)
        const newCount = (messages.total ?? 0) + addValue

        await MessagesRepository.updateOne(chatId, id, {total: newCount})
        return newCount
    }
}