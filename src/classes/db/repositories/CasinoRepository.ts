import { RootFilterQuery } from 'mongoose'
import Casino from '../../../interfaces/schemas/Casino'
import CasinoModel from '../models/CasinoModel'

type T = Casino

export default class CasinoRepository {
    static async create(data: T): Promise<T> {
        const obj = new CasinoModel(data)
        await obj.save()

        return obj
    }

    static async findOne(id: number): Promise<T | null> {
        return await CasinoModel.findOne({id})
    }

    static async findMany(filter?: RootFilterQuery<T>): Promise<T[]> {
        return await CasinoModel.find(filter ?? {})
    }

    static async deleteOne(id: number): Promise<T | null> {
        return await CasinoModel.findOneAndDelete({id})
    }

    static async updateOne(id: number, data: Partial<T>): Promise<T | null> {
        return await CasinoModel.findOneAndUpdate({id}, data)
    }
}