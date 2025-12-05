import Roulette from '../../../../interfaces/schemas/games/Roulette'
import { WINSTREAK_COUNT, WINSTREAK_PRIZE } from '../../../../utils/values/consts'
import RouletteRepository from '../../repositories/RouletteRepository'
import CasinoAddService from '../casino/CasinoAddService'

export default class {
    static async get(chatId: number, id: number): Promise<Roulette> {
        const found = await RouletteRepository.findOne(chatId, id)
        if(!found) return await RouletteRepository.create({chatId, id})
        return found
    }

    static async getPrize(chatId: number, id: number) {
        const roulette = await this.get(chatId, id)
        const winStreak = roulette.winStreak ?? 0
        const needPrize = winStreak > 0 && winStreak % WINSTREAK_COUNT == 0
        const prize = needPrize ? 
            WINSTREAK_PRIZE * Math.floor(winStreak / WINSTREAK_COUNT) :
            0

        if(needPrize) {
            await CasinoAddService.money(chatId, id, prize)
        }

        return {
            winStreak,
            prize
        }
    }

    static async win(chatId: number, id: number) {
        const {
            winStreak,
            maxWinStreak
        } = await this.get(chatId, id)

        const newWinStreak = (winStreak ?? 0) + 1
        const newMaxWinStreak = Math.max(newWinStreak, maxWinStreak ?? 0)

        await RouletteRepository.updateOne(
            chatId,
            id,
            {
                winStreak: newWinStreak,
                maxWinStreak: newMaxWinStreak
            }
        )
        return await this.getPrize(chatId, id)
    }

    static async getMax(chatId: number, id: number) {
        const roulette = await this.get(chatId, id)
        return roulette.maxWinStreak ?? 0
    }

    static async lose(chatId: number, id: number) {
        await RouletteRepository.updateOne(
            chatId,
            id,
            {
                winStreak: 0
            }
        )
        return await this.getPrize(chatId, id)
    }

    static async getAll(chatId: number) {
        return await RouletteRepository.findManyInChat(chatId)
    }
}