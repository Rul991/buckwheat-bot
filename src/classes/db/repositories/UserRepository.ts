import { RootFilterQuery } from 'mongoose'
import User from '../../../interfaces/schemas/User'
import UserModel from '../models/UserModel'

type T = User

export default class UserRepository {
    static async create(data: T): Promise<T> {
        const obj = new UserModel(data)
        await obj.save()

        return obj
    }

    static async findOne(id: number): Promise<T | null> {
        return await UserModel.findOne({id})
    }

    static async findMany(filter?: RootFilterQuery<T>): Promise<T[]> {
        return await UserModel.find(filter ?? {})
    }

    static async deleteOne(id: number): Promise<T | null> {
        return await UserModel.findOneAndDelete({id})
    }

    static async updateOne(id: number, data: Partial<T>): Promise<T | null> {
        return await UserModel.findOneAndUpdate({id}, data)
    }
}