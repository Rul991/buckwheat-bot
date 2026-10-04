import DuelistService from "../../../db/services/duel/DuelistService"
import BalanceService from "../../../db/services/money/BalanceService"
import type { BotUseActionOptions } from "../../../types/action-options"
import MessageUtils from "../../../utils/bot/MessageUtils"
import ClassUtils from "../../../utils/db/ClassUtils"
import LevelUtils from "../../../utils/level/LevelUtils"
import UseAction from "../base/UseAction"

export default class LevelUpUseAction extends UseAction {
    private _prizePerLevel = 2

    private _getPrize(level: number, levelUps: number): number {
        const oldLevel = level - levelUps
        const sum = (oldLevel + level - 1) * levelUps / 2
        return sum * this._prizePerLevel
    }

    override async execute(options: BotUseActionOptions): Promise<boolean | void> {
        const {
            ctx,
            chatId,
            id
        } = options

        const user = await ctx.vars.user.get()
        const level = await ctx.vars.level.get()

        const [levelUps, currentLevel] = level ? LevelUtils.getLevelUps(level) : [0, LevelUtils.min]
        const className = user?.className ?? ClassUtils.defaultClassName

        if (levelUps > 0) {
            const totalPrize = this._getPrize(currentLevel, levelUps)

            await Promise.allSettled([
                BalanceService.add({
                    chatId,
                    id,
                    money: totalPrize,
                }),
                DuelistService.save({
                    chatId,
                    id,
                    className,
                    level: currentLevel
                }),
                MessageUtils.reply(
                    ctx,
                    'level/up',
                    {
                        vars: {
                            currentLevel,
                            levelUps,
                            totalPrize
                        }
                    }
                )
            ])
        }
    }
}