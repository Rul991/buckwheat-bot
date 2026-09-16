import { ROULETTE_WIN_CHANCE } from "../../../consts/chances"
import RandomUtils from "../../../utils/math/RandomUtils"
import Roulette from "../../entities/roulette/Roulette"
import BaseService from "../base/BaseService"

type GameResult = {
    isWin: boolean
    roulette: Roulette | undefined
}

class RouletteService extends BaseService<typeof Roulette> {
    constructor() {
        super(Roulette)
    }

    async get(chatId: number, id: number): Promise<Roulette> {
        const filter = {
            chatId,
            id
        }

        return await this._repo.getOrCreate(
            filter,
            new Roulette(filter)
        )
    }

    async getAllByChatId(chatId: number): Promise<Roulette[]> {
        return await this._repo.find({ chatId })
    }

    async win(chatId: number, id: number): Promise<Roulette | undefined> {
        const result = await this._repo.model.findOneAndUpdate(
            {
                chatId,
                id
            },
            {
                $inc: {
                    currentWinStreak: 1,
                    maxWinStreak: 0,
                }
            },
            {
                lean: true,
                returnDocument: 'after',
                upsert: true
            }
        ).exec() ?? undefined
        return result
    }

    async lose(chatId: number, id: number): Promise<Roulette | undefined> {
        const roulette = await this.get(chatId, id)
        const newMaxWinStreak = Math.max(
            roulette.currentWinStreak,
            roulette.maxWinStreak
        )

        return await this._repo.updateOne(
            {
                chatId,
                id
            },
            {
                currentWinStreak: 0,
                maxWinStreak: newMaxWinStreak
            }
        )
    }

    async game(chatId: number, id: number): Promise<GameResult> {
        const isWin = RandomUtils.chance(ROULETTE_WIN_CHANCE)

        if (isWin) {
            return {
                isWin,
                roulette: await this.win(chatId, id)
            }
        }
        else {
            return {
                isWin,
                roulette: await this.lose(chatId, id)
            }
        }
    }
}

export default new RouletteService()