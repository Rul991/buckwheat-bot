import BuckwheatCommand from '../../base/BuckwheatCommand'
import CasinoAccountService from '../../../db/services/casino/CasinoAccountService'
import MessageUtils from '../../../../utils/MessageUtils'
import ItemsService from '../../../db/services/items/ItemsService'
import Casino from '../../../../interfaces/schemas/games/Casino'
import StringUtils from '../../../../utils/StringUtils'
import InventoryItem from '../../../../interfaces/schemas/items/InventoryItem'
import CubeService from '../../../db/services/cube/CubeService'
import DuelistService from '../../../db/services/duelist/DuelistService'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'

export default class BalanceCommand extends BuckwheatCommand {
    protected _settingId: string = 'balance'

    constructor() {
        super()
        this._name = 'баланс'
        this._description = 'показываю ваш баланс'
        this._aliases = ['кошелек', 'казино', 'дуэли']
    }

    private static _getGamesStatistic({wins = 0, loses = 0}: {wins?: number, loses?: number}) {
        const games = Math.max(1, wins + loses)
        const winrate = Math.floor(wins / games * 100 * 10) / 10

        return {
            wins: StringUtils.toFormattedNumber(wins),
            loses: StringUtils.toFormattedNumber(loses),
            winrate: StringUtils.toFormattedNumber(winrate),
        }
    }

    private static _getItemsStatistic(items: InventoryItem[] = []) {
        let unique = 0
        let total = 0

        items.forEach(item => {
            const count = item.count ?? 0
            total += count
            unique += count > 0 ? 1 : 0
        })

        return {
            unique: StringUtils.toFormattedNumber(unique),
            total: StringUtils.toFormattedNumber(total)
        }
    }

    private static _getCasinoValue(casino: Casino, key: keyof Casino): number {
        return casino[key] ?? 0
    }

    async execute({ ctx, chatId, id }: BuckwheatCommandOptions): Promise<void> {
        const casino = await CasinoAccountService.get(chatId, id)
        const items = await ItemsService.get(chatId, id)
        const cube = await CubeService.get(chatId, id)
        const money = BalanceCommand._getCasinoValue(casino, 'money')
        const duelist = await DuelistService.get(chatId, id)

        await MessageUtils.answerMessageFromResource(
            ctx, 
            'text/commands/balance/balance.pug', 
            {
                changeValues: {
                    money: StringUtils.toFormattedNumber(money),
                    isNegativeMoney: money < 0,
                    casino: BalanceCommand._getGamesStatistic(casino),
                    cube: BalanceCommand._getGamesStatistic(cube),
                    duels: BalanceCommand._getGamesStatistic(duelist),
                    itemsLength: BalanceCommand._getItemsStatistic(items.items)
                }
            }
        )
    }
}