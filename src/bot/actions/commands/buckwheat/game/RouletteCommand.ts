import { DEAD_HEALTH } from "../../../../../consts/number"
import Roulette from "../../../../../db/entities/roulette/Roulette"
import DuelistService from "../../../../../db/services/duel/DuelistService"
import BalanceService from "../../../../../db/services/money/BalanceService"
import RouletteService from "../../../../../db/services/roulette/RouletteService"
import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import AdminUtils from "../../../../../utils/bot/AdminUtils"
import RankUtils from "../../../../../utils/db/RankUtils"
import BuckwheatCommand from "../../../base/BuckwheatCommand"

export default class RouletteCommand extends BuckwheatCommand {
    override aliases: string[] = []
    override minimumRank: number = RankUtils.min
    override settingId: number = 47
    override name: string = 'рулетка'
    override filename: string = 'roulette'

    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            chatId,
            id,
            ctx,
        } = options
        const user = await ctx.vars.user.get()
        const duelist = await ctx.vars.duelist.get()

        if (ctx.chat.type == 'private') {
            return {
                key: 'roulette/private'
            }
        }

        if ((duelist?.hp ?? DEAD_HEALTH) <= DEAD_HEALTH) {
            return {
                key: 'roulette/dead',
                options: {
                    vars: {
                        user
                    }
                }
            }
        }

        const {
            isWin,
            roulette
        } = await RouletteService.game(chatId, id)
        const prize = Roulette.getPrize(roulette)

        if (prize > 0) {
            await BalanceService.add({
                chatId,
                id,
                money: prize
            })
        }
        else if (!isWin) {
            await DuelistService.dead(chatId, id)

            const isKicked = await AdminUtils.gameKick({
                ctx,
                chatId,
                id,
            })

            return {
                key: 'roulette/lose',
                options: {
                    vars: {
                        prize,
                        user,
                        isKicked
                    }
                }
            }
        }

        return {
            key: 'roulette/win',
            options: {
                vars: {
                    prize,
                    user,
                    roulette
                }
            }
        }
    }
}