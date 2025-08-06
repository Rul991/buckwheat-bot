import { RootFilterQuery } from 'mongoose'
import Messages from '../../../interfaces/schemas/Messages'
import MessagesModel from '../models/MessagesModel'

type T = Messages

export default class MessagesRepository {
    static async create(data: T): Promise<T> {
        const obj = new MessagesModel(data)
        await obj.save()

        return obj
    }

    static async findOne(id: number): Promise<T | null> {
        return await MessagesModel.findOne({id})
    }

    static async findMany(filter?: RootFilterQuery<T>): Promise<T[]> {
        return await MessagesModel.find(filter ?? {})
    }

    static async deleteOne(id: number): Promise<T | null> {
        return await MessagesModel.findOneAndDelete({id})
    }

    static async updateOne(id: number, data: Partial<T>): Promise<T | null> {
        return await MessagesModel.findOneAndUpdate({id}, data)
    }
}