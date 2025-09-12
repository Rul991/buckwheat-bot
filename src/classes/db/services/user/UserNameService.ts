import { DEFAULT_USER_NAME } from '../../../../utils/values/consts'
import UserRepository from '../../repositories/UserRepository'
import BaseUserService from './BaseUserService'

export default class UserNameService {
    static async get(chatId: number, id: number): Promise<string> {
        return (await BaseUserService.get<string>(chatId, id, 'name')) ?? DEFAULT_USER_NAME
    }

    static async getAll(chatId: number): Promise<string[]> {
        const users = await UserRepository.findManyInChat(chatId)

        return users.map(user => user.name)
    }

    static async update(chatId: number, id: number, name: string): Promise<string | null> {
        return (await BaseUserService.update(chatId, id, 'name', name))
    }

    static async getAllByName(chatId: number, name: string): Promise<string[]> {
        return (await UserRepository.findManyInChat(chatId, {name})).map(user => user.name)
    }

    static async getUniqueName(chatId: number, name: string): Promise<string> {
        const names = await this.getAllByName(chatId, name)

        if(names.length > 1) {
            return `${name}${names.length}`
        }
        else {
            return name
        }
    }
}