import { RootFilterQuery } from 'mongoose'
import Ideas from '../../../interfaces/schemas/Ideas'
import IdeasModel from '../models/IdeasModel'

type T = Ideas

export default class IdeasRepository {
    static async create(data: T): Promise<T> {
        const obj = new IdeasModel(data)
        await obj.save()

        return obj
    }

    static async findOne(): Promise<T | null> {
        return await IdeasModel.findOne()
    }

    static async findMany(filter?: RootFilterQuery<T>): Promise<T[]> {
        return await IdeasModel.find(filter ?? {})
    }

    static async deleteOne(): Promise<T | null> {
        return await IdeasModel.findOneAndDelete()
    }

    static async updateOne(data: Partial<T>): Promise<T | null> {
        return await IdeasModel.findOneAndUpdate({}, data)
    }
}