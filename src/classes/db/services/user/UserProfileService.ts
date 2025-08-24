import User from '../../../../interfaces/schemas/User'
import { DEFAULT_USER_NAME } from '../../../../utils/values/consts'
import UserRepository from '../../repositories/UserRepository'

export default class UserProfileService {
    static async create(id: number, name?: string): Promise<User> {
        const foundUser = await UserRepository.findOne(id)
        if(foundUser) return foundUser

        const user = await UserRepository.create({
            id,
            name: name || await this.getDefaultUserName(),
        })

        return user
    }

    static async getDefaultUserName(): Promise<string> {
        return `${DEFAULT_USER_NAME}${await this.getMembersCount()}`
    }

    static async update(id: number, profile: Partial<User>): Promise<User | null> {
        await this.create(id)
        return await UserRepository.updateOne(id, profile)
    }

    static async get(id: number): Promise<User | null> {
        return await UserRepository.findOne(id)
    }

    static async findByName(name: string): Promise<User | null> {
        return (await UserRepository.findMany({name}))[0]
    }

    static async getAll(): Promise<User[]> {
        return await UserRepository.findMany()
    }

    static async getMembersCount(): Promise<number> {
        return (await UserRepository.findMany()).length
    }
}