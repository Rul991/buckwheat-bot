import { setTimeout } from "node:timers/promises"
import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import MessageUtils from "../../../../../utils/bot/MessageUtils"
import RankUtils from "../../../../../utils/db/RankUtils"
import RandomUtils from "../../../../../utils/math/RandomUtils"
import BuckwheatCommand from "../../../base/BuckwheatCommand"
import { COIN_DROP_TIME } from "../../../../../consts/time"

export default class MoneyDropCommand extends BuckwheatCommand {
    override aliases: string[] = ['орел-решка', 'монета', 'диньдинь', 'динь-динь']
    override minimumRank: number = RankUtils.min
    override settingId: number = 40
    override name: string = 'монетка'
    override filename: string = 'moneydrop'
    
    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            ctx
        } = options
        const money = (await ctx.vars.balance.get())?.total ?? 0

        if(money <= 0) {
            return {
                key: 'moneydrop/no-money'
            }
        }
        
        await MessageUtils.reply(
            ctx,
            'moneydrop/coin'
        )
        await setTimeout(COIN_DROP_TIME)
        
        const result = RandomUtils.halfChance()
        return {
            key: 'moneydrop/done',
            options: {
                vars: {
                    result
                }
            }
        }
    }
}