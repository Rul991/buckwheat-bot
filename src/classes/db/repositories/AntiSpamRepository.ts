import { RootFilterQuery } from 'mongoose'
import AntiSpam from '../../../interfaces/schemas/AntiSpam'
import AntiSpamModel from '../models/AntiSpamModel'

type T = AntiSpam

export default class AntiSpamRepository {
    static async create(data: T): Promise<T> {
        const obj = new AntiSpamModel(data)
        await obj.save()

        return obj
    }

    static async findOne(id: number): Promise<T | null> {
        return await AntiSpamModel.findOne({id})
    }

    static async findMany(filter?: RootFilterQuery<T>): Promise<T[]> {
        return await AntiSpamModel.find(filter ?? {})
    }

    static async deleteOne(id: number): Promise<T | null> {
        return await AntiSpamModel.findOneAndDelete({id})
    }

    static async updateOne(id: number, data: Partial<T>): Promise<T | null> {
        return await AntiSpamModel.findOneAndUpdate({id}, data)
    }
}