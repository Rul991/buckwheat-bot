import { Context } from 'telegraf'
import MathUtils from '../MathUtils'
import MessageUtils from '../MessageUtils'
import ContextUtils from '../ContextUtils'
import { LEVEL_UP_MONEY } from '../values/consts'

export default class LevelUtils {
    static min = 1
    static max = 99

    static multiplier = 1.95
    static firstLevelExperience = 90

    static clamp(level: number): number {
        return MathUtils.clamp(level, this.min, this.max)
    }

    static get(experience: number): number {
        return this.clamp(Math.floor(((experience + this.firstLevelExperience) ** (1 / this.multiplier)) / 10))
    }

    static async sendLevelUpMessage(ctx: Context, newLevel: number): Promise<void> {
        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/level/level-up.pug',
            {
                changeValues: {
                    ...await ContextUtils.getUserFromContext(ctx),
                    lvl: newLevel,
                    money: newLevel * LEVEL_UP_MONEY
                }
            }
        )
    }
}