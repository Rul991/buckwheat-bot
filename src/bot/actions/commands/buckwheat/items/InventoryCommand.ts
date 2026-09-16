import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import RankUtils from "../../../../../utils/db/RankUtils"
import { startInventoryKeyboard } from "../../../../keyboards/inventory"
import BuckwheatCommand from "../../../base/BuckwheatCommand"

export default class InventoryCommand extends BuckwheatCommand {
    override aliases: string[] = ['вещи', 'предметы']
    override filename: string = 'inventory'
    override minimumRank: number = RankUtils.min
    override settingId: number = 71
    override name: string = 'инвентарь'
    
    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            ctx,
            id
        } = options

        return {
            key: 'inventory/start',
            options: {
                keyboard: await startInventoryKeyboard(
                    ctx,
                    {
                        id
                    }
                )
            }
        }
    }
}