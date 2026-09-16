import { prop } from "@typegoose/typegoose"
import ChatIdEntity from "../base/ChatIdEntity"
import { ROULETTE_PRIZE, ROULETTE_PRIZE_WINSTREAK } from "../../../consts/number"

export default class Roulette extends ChatIdEntity {
    static getPrize(roulette: Roulette | undefined): number {
        if(!roulette) return 0
        if(roulette.currentWinStreak <= 0 || roulette.currentWinStreak % ROULETTE_PRIZE_WINSTREAK != 0) return 0

        return (roulette.currentWinStreak / ROULETTE_PRIZE_WINSTREAK) * ROULETTE_PRIZE
    }

    @prop()
    currentWinStreak: number

    @prop()
    maxWinStreak: number

    constructor({
        chatId,
        id
    }: Pick<Roulette, 'chatId' | 'id'>) {
        super(chatId, id)

        this.currentWinStreak = 0
        this.maxWinStreak = 0
    }
}