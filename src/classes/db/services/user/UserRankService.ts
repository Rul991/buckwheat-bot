import User from '../../../../interfaces/schemas/User'
import UserRepository from '../../repositories/UserRepository'
import BaseUserService from './BaseUserService'

export default class UserRankService {
    static async get(chatId: number, id: number): Promise<number> {
        return (await BaseUserService.get<number>(chatId, id, 'rank')) ?? -1
    }

    static async update(chatId: number, id: number, rank: number): Promise<number> {
        return (await BaseUserService.update(chatId, id, 'rank', rank)) ?? -1
    }

    static async findByRank(chatId: number, rank: number): Promise<User[]> {
        return await UserRepository.findManyInChat(chatId, {rank})
    }
}