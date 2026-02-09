import DuelService from '../../classes/db/services/duel/DuelService'
import SkillAttack from '../../enums/SkillAttack'
import Duel from '../../interfaces/schemas/duels/Duel'
import ContextUtils from '../ContextUtils'
import MessageUtils from '../MessageUtils'
import RandomUtils from '../RandomUtils'
import { DuelEndUtilsOptions, Duelists } from '../values/types/duels'

export default class DuelUtils {
    static getDummy(chatId?: number, id?: number): Duel {
        return {
            id: -1,
            chatId: chatId ?? 0,
            firstDuelist: id ?? 0,
            secondDuelist: id ?? 0,
            steps: [
                {
                    attack: SkillAttack.Normal,
                    characteristics: new Map().set(`${id ?? 0}`, {hp: 1, mana: 1}),
                    duelist: id ?? 0,
                    effects: [],
                    skill: 'attack-unknown',
                    startTime: Date.now()
                }
            ]
        }
    }

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