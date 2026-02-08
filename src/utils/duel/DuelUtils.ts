import DuelService from '../../classes/db/services/duel/DuelService'
import ContextUtils from '../ContextUtils'
import MessageUtils from '../MessageUtils'
import RandomUtils from '../RandomUtils'
import { DuelEndOptions, DuelEndUtilsOptions, Duelists } from '../values/types/duels'

export default class DuelUtils {
    static getEnemy(duel: Duelists, id: number): number {
        return duel.firstDuelist == id ? duel.secondDuelist : duel.firstDuelist
    }

    static getRandomDuelist({
        firstDuelist,
        secondDuelist
    }: Duelists) {
        return RandomUtils.choose([firstDuelist, secondDuelist])!
    }

    static async end(options: DuelEndUtilsOptions) {
        const {
            ctx,
            chatId
        } = options
        
        const duelEndResult = await DuelService.end(options)
        const {
            winner,
            loser,
            experience,
            prize
        } = duelEndResult

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/duel/fight/end.pug',
            {
                changeValues: {
                    winner: await ContextUtils.getUser(chatId, winner),
                    loser: await ContextUtils.getUser(chatId, loser),
                    experience,
                    prize
                }
            }
        )
    }
}