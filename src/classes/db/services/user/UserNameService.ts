import UserRepository from '../../repositories/UserRepository'
import BaseUserService from './BaseUserService'

export default class UserNameService {
    static async get(id: number): Promise<string | null> {
        return (await BaseUserService.get<string>(id, 'name'))
    }

    static async getAll(): Promise<string[]> {
        const users = await UserRepository.findMany()

        return users.map(user => user.name)
    }

    static async update(id: number, name: string): Promise<string | null> {
        return (await BaseUserService.update(id, 'name', name))
    }
}