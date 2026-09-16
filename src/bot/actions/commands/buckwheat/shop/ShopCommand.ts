import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import RankUtils from "../../../../../utils/db/RankUtils"
import { startShopKeyboard } from "../../../../keyboards/shop"
import BuckwheatCommand from "../../../base/BuckwheatCommand"

export default class ShopCommand extends BuckwheatCommand {
    override aliases: string[] = ['магаз', 'купить']
    override filename: string = 'shop'
    override minimumRank: number = RankUtils.min
    override settingId: number = 85
    override name: string = 'магазин'
    
    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            ctx,
            id
        } = options

        return {
            key: 'shop/start',
            options: {
                vars: {

                },
                keyboard: await startShopKeyboard(ctx, {
                    id
                })
            }
        }
    }
}