import { RootFilterQuery } from 'mongoose'
import Items from '../../../interfaces/schemas/Items'
import ItemsModel from '../models/ItemsModel'

type T = Items

export default class ItemsRepository {
    static async create(data: T): Promise<T> {
        const obj = new ItemsModel(data)
        await obj.save()

        return obj
    }

    static async findOne(id: number): Promise<T | null> {
        return await ItemsModel.findOne({id})
    }

    static async findMany(filter?: RootFilterQuery<T>): Promise<T[]> {
        return await ItemsModel.find(filter ?? {})
    }

    static async deleteOne(id: number): Promise<T | null> {
        return await ItemsModel.findOneAndDelete({id})
    }

    static async updateOne(id: number, data: Partial<T>): Promise<T | null> {
        return await ItemsModel.findOneAndUpdate({id}, data)
    }
}