import { DUEL_EXPERIENCE_PER_STEP, MIN_DUEL_STEPS_FOR_LEVEL } from "../../../consts/number"
import DuelUtils from "../../../utils/duel/duel/DuelUtils"
import Duel from "../../entities/duel/Duel"
import BaseService from "../base/BaseService"
import GameService from "../game/GameService"
import LevelService from "../level/LevelService"
import BalanceService from "../money/BalanceService"
import DuelStepService from "./DuelStepService"

type GetPrizesOptions = {
    chatId: number
    first: number
    second: number
    prize: number
}

type GetPrizesResult = {
    total: number
    first: number
    second: number
}

type EndResult = {
    experience: number
    prize: number
}

class DuelService extends BaseService<typeof Duel> {
    constructor() {
        super(Duel)
    }

    override async create(obj: Duel): Promise<Duel> {
        return await this._repo.getOrCreate(
            {
                chatId: obj.chatId
            },
            obj
        )
    }

    async get(chatId: number) {
        return await this._repo.findOne({ chatId })
    }

    async delete(chatId: number) {
        const [duelResult, duelStepResult] = await Promise.all([
            this._repo.deleteOne({ chatId }),
            DuelStepService.deleteByChatId(chatId),
        ])

        return duelStepResult && duelResult.deletedCount > 0
    }

    async getPrizes({
        chatId,
        first,
        second,
        prize
    }: GetPrizesOptions): Promise<GetPrizesResult> {
        const firstLevel = await LevelService.getCurrentLevel(chatId, first)
        const secondLevel = await LevelService.getCurrentLevel(chatId, second)
        const totalLevel = firstLevel + secondLevel

        const firstPrize = Math.floor(prize * (firstLevel / totalLevel))
        const secondPrize = Math.floor(prize * (secondLevel / totalLevel))
        const totalPrize = firstPrize + secondPrize

        return {
            total: totalPrize,
            first: firstPrize,
            second: secondPrize
        }
    }

    async end(chatId: number, winner: number): Promise<EndResult> {
        const duel = await this.get(chatId)
        if (!duel) return {
            prize: 0,
            experience: 0
        }

        const steps = await DuelStepService.count(chatId)
        const experience = steps >= MIN_DUEL_STEPS_FOR_LEVEL ?
            steps * DUEL_EXPERIENCE_PER_STEP :
            0
        const {
            prize,
            duelists,
        } = duel

        await Promise.all([
            BalanceService.add({
                chatId,
                id: winner,
                money: prize
            }),
            ...duelists.map(async id => {
                return [
                    GameService.stop({
                        chatId,
                        id,
                        key: winner == id ? 'wins' : 'loses',
                        type: 'duel'
                    }),
                    experience > 0 && LevelService.add(chatId, id, experience)
                ]
            }),
            this.delete(chatId),
        ])

        return {
            experience,
            prize
        }
    }

    async getCurrentDuelist(chatId: number): Promise<number> {
        const duel = await this.get(chatId)
        if(!duel) return 0

        const lastStep = await DuelStepService.getLast(chatId)
        if(!lastStep) return duel.duelists[0]!

        return DuelUtils.getEnemy(duel, lastStep.duelist)
    }
}

export default new DuelService()