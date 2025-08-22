import { Context } from 'telegraf'
import MathUtils from '../MathUtils'
import MessageUtils from '../MessageUtils'
import ContextUtils from '../ContextUtils'

export default class LevelUtils {
    static min = 1
    static max = 99

    static clamp(level: number): number {
        return MathUtils.clamp(level, this.min, this.max)
    }

    static get(experience: number): number {
        return Math.floor(((experience + 32) ** (1 / 1.5)) / 10)
    }

    static async sendLevelUpMessage(ctx: Context, newLevel: number): Promise<void> {
        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/level/level-up.pug',
            {
                changeValues: {
                    ...await ContextUtils.getUser(
                        ctx.from?.id, 
                        ctx.from?.first_name
                    ),
                    lvl: newLevel
                }
            }
        )
    }
}