import Messages from '../../../../interfaces/schemas/Messages'
import MessagesRepository from '../../repositories/MessagesRepository'

export default class MessagesService {
    static async get(id: number): Promise<Messages> {
        const messages = await MessagesRepository.findOne(id)

        if(messages) return messages
        else return await MessagesRepository.create({id, firstMessage: Date.now()})
    }

    static async getAll(): Promise<Messages[]> {
        return await MessagesRepository.findMany()
    }

    static async add(id: number, addValue = 1): Promise<number> {
        const messages = await this.get(id)
        const newCount = (messages.total ?? 0) + addValue

        await MessagesRepository.updateOne(id, {total: newCount})
        return newCount
    }
}