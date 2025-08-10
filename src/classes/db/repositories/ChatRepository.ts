import ChatModel from '../models/ChatModel'
import Chat from '../../../interfaces/schemas/Chat'

export default class ChatRepository {
    static async create(): Promise<Chat> {
        const obj = new ChatModel({})
        await obj.save()

        return obj
    }

    static async get(): Promise<Chat> {
        return await ChatModel.findOne() ?? this.create()
    }

    static async updateOne(data: Partial<Chat>): Promise<Chat | null> {
        return await ChatModel.findOneAndUpdate({}, data)
    }
}