import InventoryItemService from "../../../../../db/services/items/InventoryItemService"
import { greedBoxItem } from "../../../../../resources/items/inventory"
import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import RankUtils from "../../../../../utils/db/RankUtils"
import BuckwheatCommand from "../../../base/BuckwheatCommand"

export default class GreedBoxCommand extends BuckwheatCommand {
    override aliases: string[] = ['ларчик']
    override filename: string = 'greed-box'
    override minimumRank: number = RankUtils.min
    override settingId: number = 79
    override name: string = 'шкатулка'
    
    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            chatId,
            id,
            ctx
        } = options

        const {
            ok
        } = await InventoryItemService.use({
            chatId,
            id,
            item: greedBoxItem,
            count: 1,
            ctx
        })

        if(!ok) {
            return {
                key: 'greed-box/no-box'
            }
        }
    }
}