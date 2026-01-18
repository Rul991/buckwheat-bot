import Duel from '../../../../interfaces/schemas/duels/Duel'
import DuelStep from '../../../../interfaces/schemas/duels/DuelStep'
import RandomUtils from '../../../../utils/RandomUtils'
import { DUEL_PRICE_PER_LEVEL, MIN_STEPS_FOR_LEVEL_IN_DUEL } from '../../../../utils/values/consts'
import { DuelCanUseOptions, DuelEndOptions, DuelResult } from '../../../../utils/values/types/types'
import DuelRepository from '../../repositories/DuelRepository'
import CasinoAddService from '../casino/CasinoAddService'
import CasinoGetService from '../casino/CasinoGetService'
import DuelistService from '../duelist/DuelistService'
import ExperienceService from '../level/ExperienceService'
import LevelService from '../level/LevelService'

type OptionalDuel = Omit<Duel, 'id' | 'step'> & {
    id?: number,
    step?: DuelStep
}

export default class DuelService {
    static async create(data: OptionalDuel): Promise<Duel> {
        const id = await this.getNewIndex()
        const duelist = RandomUtils.halfChance() ? data.firstDuelist : data.secondDuelist
        return await DuelRepository.create({
            ...data,
            id,
            step: {
                duelist,
                lastStep: {
                    duelist
                }
            }
        })
    }

    static async getNewIndex() {
        const duels = await DuelRepository.findMany()
        return duels.reduce((prev, curr) => {
            if (curr.id > prev)
                return curr.id
            else
                return prev
        }, -1) + 1
    }

    static async get(id: number): Promise<Duel | null> {
        return await DuelRepository.findOne(id)
    }

    static async delete(id: number): Promise<Duel | null> {
        return await DuelRepository.deleteOne(id)
    }

    static async end({ chatId, duelId, winnerId }: DuelEndOptions): Promise<DuelResult | null> {
        const duel = await this.get(duelId)
        if (!duel) return null

        const { firstDuelist, secondDuelist } = duel

        const getId = (isFirstDuelist: boolean) =>
            isFirstDuelist == (winnerId == firstDuelist) ? firstDuelist : secondDuelist

        const winner = getId(true)
        const loser = getId(false)
        const ids = [winner, loser]

        const [winnerPrice, loserPrice] = (await Promise.all(
            ids.map(id => this.getPriceStats(chatId, id))
        )).map(v => v.price)

        const totalWinPrice = winnerPrice + loserPrice

        await Promise.allSettled(
            [
                ...ids.map(async id =>
                    DuelistService.setField(chatId, id, 'onDuel', false)
                ),
                DuelistService.addField(chatId, winner, 'wins'),
                DuelistService.addField(chatId, loser, 'loses'),
                CasinoAddService.money(chatId, winner, totalWinPrice),
            ]
        )

        await DuelRepository.deleteOne(duelId)

        return {
            winner,
            loser,
            duel,
            prize: totalWinPrice,
            experience: (duel.steps ?? 0) >= MIN_STEPS_FOR_LEVEL_IN_DUEL ? await ExperienceService.addExperienceAfterDuel(
                chatId,
                winner,
                loser
            ) : { first: 0, second: 0 }
        }
    }

    static async getPriceStats(chatId: number, id: number) {
        const money = await CasinoGetService.money(chatId, id)
        const level = await LevelService.get(chatId, id)
        const price = DUEL_PRICE_PER_LEVEL * level

        return {
            money,
            level,
            price
        }
    }

    static async canUse({ user, duel: duelId }: DuelCanUseOptions) {
        const duel = await this.get(duelId)
        if (!duel) return false

        return user == duel.step.duelist
    }

    static async getByUserId(chatId: number, userId: number) {
        return await DuelRepository.findByFilter({
            chatId,
            $or: [
                { firstDuelist: userId },
                { secondDuelist: userId }
            ]
        })
    }

    private static async _getDuelist(id: number, userId?: number) {
        if(userId) return userId

        const duel = await this.get(id)
        if (!duel) return undefined

        const { firstDuelist, secondDuelist, step: { duelist } } = duel
        return duelist == firstDuelist ? secondDuelist : firstDuelist
    }

    static async changeDuelist(duelId: number, userId?: number) {
        return await DuelRepository.updateOne(duelId, {
            step: {
                duelist: await this._getDuelist(duelId, userId)
            },
            $inc: {
                steps: 1
            }
        })
    }
}