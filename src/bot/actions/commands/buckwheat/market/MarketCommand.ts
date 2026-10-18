import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import RankUtils from "../../../../../utils/db/RankUtils"
import { startMarketKeyboard } from "../../../../keyboards/market"
import BuckwheatCommand from "../../../base/BuckwheatCommand"

export default class MarketCommand extends BuckwheatCommand {
    override aliases: string[] = ['маркет']
    override filename: string = 'market'
    override minimumRank: number = RankUtils.min
    override settingId: number = 141
    override name: string = 'рынок'

    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            id,
            ctx
        } = options

        return {
            key: 'market/message/start',
            options: {
                keyboard: await startMarketKeyboard(ctx, { id })
            }
        }
    }
}