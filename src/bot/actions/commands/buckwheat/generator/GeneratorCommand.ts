import InventoryItemService from "../../../../../db/services/items/InventoryItemService"
import { moneyGenLicenseItem } from "../../../../../resources/items/inventory"
import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import RankUtils from "../../../../../utils/db/RankUtils"
import GeneratorUtils from "../../../../../utils/generator/GeneratorUtils"
import BuckwheatCommand from "../../../base/BuckwheatCommand"

export default class GeneratorCommand extends BuckwheatCommand {
    override aliases: string[] = ['генераторы', 'ген']
    override filename: string = 'generator'
    override minimumRank: number = RankUtils.min
    override settingId: number = 135
    override name: string = 'генератор'
    
    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            chatId,
            ctx,
            id,
        } = options

        const hasLicense = await InventoryItemService.hasByUser({
            chatId,
            id,
            item: moneyGenLicenseItem
        })
        const user = await ctx.vars.user.get()

        if(!hasLicense) {
            return {
                key: 'generator/message/no-license',
                options: {
                    vars: {
                        user
                    }
                }
            }
        }

        return await GeneratorUtils.show(ctx)
    }
}