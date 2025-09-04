import User from '../../../../interfaces/schemas/User'
import { DEFAULT_USER_NAME } from '../../../../utils/values/consts'
import UserRepository from '../../repositories/UserRepository'

export default class UserProfileService {
    static async create(chatId: number, id: number, name?: string): Promise<User> {
        const foundUser = await this.get(chatId, id)
        if(foundUser) return foundUser

        const user = await UserRepository.create({
            id,
            chatId,
            name: name || await this.getDefaultUserName(chatId),
        })

        return user
    }

    static async getDefaultUserName(chatId: number): Promise<string> {
        return `${DEFAULT_USER_NAME}${await this.getMembersCount(chatId)}`
    }

    static async getUniqueUsers(): Promise<User[]> {
        const uniqueUsers: User[] = []
        const ids: number[] = []
        const users = await UserRepository.findMany()

        for (const user of users) {
            if(!ids.includes(user.id)) {
                ids.push(user.id)
                uniqueUsers.push(user)
            }
        }

        return uniqueUsers
    }

    static async update(chatId: number, id: number, profile: Partial<User>): Promise<User | null> {
        await this.create(chatId, id)
        return await UserRepository.updateOne(chatId, id, profile)
    }

    static async get(chatId: number, id: number): Promise<User | null> {
        return await UserRepository.findOne(chatId, id)
    }

    static async findByName(chatId: number, name: string): Promise<User | null> {
        return (await UserRepository.findMany({name}))[0]
    }

    static async getAll(chatId: number): Promise<User[]> {
        return await UserRepository.findManyInChat(chatId)
    }

    static async getMembersCount(chatId: number): Promise<number> {
        return (await (this.getAll(chatId))).length
    }
}