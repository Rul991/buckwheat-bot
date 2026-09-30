import GameService from "../../../../../db/services/game/GameService"
import InventoryItemService from "../../../../../db/services/items/InventoryItemService"
import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import RankUtils from "../../../../../utils/db/RankUtils"
import Logger from "../../../../../utils/logs/Logger"
import BuckwheatCommand from "../../../base/BuckwheatCommand"

export default class BalanceCommand extends BuckwheatCommand {
    override aliases: string[] = ['кошелек', 'деньги', 'монеты']
    override minimumRank: number = RankUtils.min
    override name: string = 'баланс'
    override filename: string = 'balance'
    override settingId: number = 14

    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            ctx,
            chatId,
            id
        } = options

        const balance = await ctx.vars.balance.get()
        const money = balance?.total ?? 0
        const inventory = await InventoryItemService.getInventory(chatId, id)

        Logger.debug('BalanceCommand', {
            balance,
            inventory
        })

        const games = await GameService.getAllByUser(chatId, id)
        const uniqueItems = inventory.length
        const items = inventory.reduce((total, item) => total + item.count, 0)

        return {
            key: 'balance/user',
            options: {
                vars: {
                    balance: money,
                    games,
                    uniqueItems,
                    items
                }
            }
        }
    }
}