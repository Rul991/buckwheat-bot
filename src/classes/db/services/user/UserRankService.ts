import User from '../../../../interfaces/schemas/User'
import UserRepository from '../../repositories/UserRepository'
import BaseUserService from './BaseUserService'

export default class UserRankService {
    static async get(id: number): Promise<number> {
        return (await BaseUserService.get<number>(id, 'rank')) ?? -1
    }

    static async update(id: number, rank: number): Promise<number> {
        return (await BaseUserService.update(id, 'rank', rank)) ?? -1
    }

    static async findByRank(rank: number): Promise<User[]> {
        return await UserRepository.findMany({rank})
    }
}