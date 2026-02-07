import { Context } from 'telegraf'
import Duel from '../../../../interfaces/schemas/duels/Duel'
import AdminUtils from '../../../../utils/AdminUtils'
import DuelStepUtils from '../../../../utils/duel/DuelStepUtils'
import DuelUtils from '../../../../utils/duel/DuelUtils'
import { FromDuelistsExtra } from '../../../../utils/values/types/duels'
import DuelRepository from '../../repositories/DuelRepository'
import CasinoAddService from '../casino/CasinoAddService'
import DuelistService from '../duelist/DuelistService'
import DuelPrepareService from './DuelPrepareService'
import DuelStepService from './DuelStepService'
import { DUEL_EXPERIENCE, MIN_STEPS_FOR_LEVEL_IN_DUEL } from '../../../../utils/values/consts'
import ExperienceService from '../level/ExperienceService'

type OptionalDuel = Omit<Duel, 'id' | 'steps'> & {
    id?: number,
}

type DuelStartOptions = OptionalDuel
type DuelEndOptions = {
    duel: Duel
    winner: number
    ctx: Context
}

export default class DuelService {
    static async create(data: OptionalDuel): Promise<Duel> {
        const id = await this.getNewIndex()
        return await DuelRepository.create({
            ...data,
            id,
            steps: [
                await DuelStepService.fromDuelists(
                    data,
                    {
                        duelist: data.firstDuelist
                    }
                )
            ]
        })
    }

    static async start(data: DuelStartOptions) {
        const {
            chatId,
            firstDuelist,
            secondDuelist
        } = data
        const duel = await this.create(data)

        const firstDuelistPrice = await DuelPrepareService.getPrice(chatId, firstDuelist)
        const secondDuelistPrice = await DuelPrepareService.getPrice(chatId, secondDuelist)

        await CasinoAddService.money(chatId, firstDuelist, -firstDuelistPrice)
        await CasinoAddService.money(chatId, secondDuelist, -secondDuelistPrice)

        return duel
    }

    static async end(options: DuelEndOptions) {
        const {
            duel,
            winner,
            ctx
        } = options

        const {
            chatId,
            steps,
            id: duelId
        } = duel

        const loser = DuelUtils.getEnemy(duel, winner)
        const [
            winnerPrize,
            loserPrize
        ] = await Promise.all([
            DuelPrepareService.getPrice(chatId, winner),
            DuelPrepareService.getPrice(chatId, loser)
        ])
        const totalPrize = winnerPrize + loserPrize

        const stepsLength = steps.length
        const experience = stepsLength >= MIN_STEPS_FOR_LEVEL_IN_DUEL ?
            Math.ceil(DUEL_EXPERIENCE * (stepsLength / MIN_STEPS_FOR_LEVEL_IN_DUEL)) :
            0

        if (experience > 0) {
            await Promise.allSettled([
                ExperienceService.add(chatId, winner, experience),
                ExperienceService.add(chatId, loser, experience),
            ])
        }

        await Promise.allSettled([
            CasinoAddService.money(chatId, winner, totalPrize),
            DuelistService.addField(chatId, winner, 'wins', 1),
            DuelistService.addField(chatId, loser, 'loses', 1),
            DuelistService.setField(chatId, winner, 'onDuel', false),
            DuelistService.setField(chatId, loser, 'onDuel', false),
            this.delete(duelId),
            AdminUtils.gameKick({
                chatId,
                id: loser,
                ctx,
                isLongKick: true
            })
        ])

        return {
            prize: totalPrize,
            experience,
            winner,
            loser
        }
    }

    static async getNewIndex() {
        return (await DuelRepository.getMaxId()) + 1
    }

    static async get(id: number): Promise<Duel | null> {
        return await DuelRepository.findOne(id)
    }

    static async delete(id: number): Promise<Duel | null> {
        return await DuelRepository.deleteOne(id)
    }

    static async getByUserId(chatId: number, id: number) {
        return await DuelRepository.findByFilter({
            chatId,
            $or: [
                {
                    firstDuelist: id
                },
                {
                    secondDuelist: id
                }
            ]
        })
    }

    static async nextStep(id: number, extra: FromDuelistsExtra) {
        const duel = await this.get(id)
        if (!duel) return false

        const {
            steps
        } = duel

        const currentStep = DuelStepUtils.getCurrent(steps)
        if (!currentStep) return false

        const you = currentStep.duelist
        const enemy = DuelUtils.getEnemy(duel, you)

        await DuelStepService.add(
            id,
            await DuelStepService.fromDuelists(
                duel,
                {
                    duelist: enemy,
                    ...extra,
                }
            )
        )

        return true
    }

    static async changeDuelist(id: number) {
        const duel = await this.get(id)
        if (!duel) return false

        const currentStep = DuelStepUtils.getCurrent(duel.steps)
        if (!currentStep) return false

        const you = currentStep.duelist
        const enemy = DuelUtils.getEnemy(duel, you)

        await DuelStepService.updateCurrent(
            id,
            {
                duelist: enemy
            }
        )
    }
}