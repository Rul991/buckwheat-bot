import { RootFilterQuery } from 'mongoose'
import Work from '../../../interfaces/schemas/Work'
import WorkModel from '../models/WorkModel'

type T = Work

export default class WorkRepository {
    static async create(data: T): Promise<T> {
        const obj = new WorkModel(data)
        await obj.save()

        return obj
    }

    static async findOne(id: number): Promise<T | null> {
        return await WorkModel.findOne({id})
    }

    static async findMany(filter?: RootFilterQuery<T>): Promise<T[]> {
        return await WorkModel.find(filter ?? {})
    }

    static async deleteOne(id: number): Promise<T | null> {
        return await WorkModel.findOneAndDelete({id})
    }

    static async updateOne(id: number, data: Partial<T>): Promise<T | null> {
        return await WorkModel.findOneAndUpdate({id}, data)
    }
}