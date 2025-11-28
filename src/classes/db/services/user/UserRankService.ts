import User from '../../../../interfaces/schemas/user/User'
import RankUtils from '../../../../utils/RankUtils'
import { NOT_FOUND_INDEX } from '../../../../utils/values/consts'
import UserRepository from '../../repositories/UserRepository'
import BaseUserService from './BaseUserService'

export default class UserRankService {
    static async get(chatId: number, id: number): Promise<number> {
        return (await BaseUserService.get<'rank'>(chatId, id, 'rank')) ?? NOT_FOUND_INDEX
    }

    static async update(chatId: number, id: number, rank: number): Promise<number> {
        return (await BaseUserService.update(chatId, id, 'rank', rank)) ?? NOT_FOUND_INDEX
    }

    static async findAllByRank(chatId: number, rank: number): Promise<User[]> {
        return await UserRepository.findManyInChat(chatId, {rank})
    }

    static async has(chatId: number, id: number, needRank: number): Promise<boolean> {
        const rank = await this.get(chatId, id)

        return rank >= needRank
    }

    static async getAllWithId(chatId: number) {
        return (await UserRepository.findManyInChat(chatId))
            .map(({rank, id}) => {
                return {
                    id,
                    rank: rank ?? RankUtils.min
                }
            })
    }
}