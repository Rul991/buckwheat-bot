import { MaybeString, TextContext } from '../../../../utils/values/types'
import BuckwheatCommand from '../../base/BuckwheatCommand'
import CasinoAccountService from '../../../db/services/casino/CasinoAccountService'
import MessageUtils from '../../../../utils/MessageUtils'
import ItemsService from '../../../db/services/items/ItemsService'
import Casino from '../../../../interfaces/schemas/Casino'
import StringUtils from '../../../../utils/StringUtils'

export default class BalanceCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'баланс'
        this._description = 'показываю ваш баланс'
    }

    private static _getCasinoValue(casino: Casino, key: keyof Casino): string {
        return casino[key] ? StringUtils.toFormattedNumber(casino[key]) : '0'
    }

    async execute(ctx: TextContext, _: MaybeString): Promise<void> {
        const casino = await CasinoAccountService.create(ctx.from.id)
        const items = await ItemsService.get(ctx.from.id)

        const uniqueItemsLength = items
            .items
            ?.reduce((prev, curr) => ((curr.count ?? 0) > 0 ? prev + 1 : prev), 0) 
            ?? 0
        
        const itemsLength = items
            .items
            ?.reduce((prev, curr) => (prev + (curr.count ?? 0)), 0) ?? 0

        await MessageUtils.answerMessageFromResource(
            ctx, 
            'text/commands/balance/balance.pug', 
            {
                changeValues: {
                    money: BalanceCommand._getCasinoValue(casino, 'money'),
                    wins: BalanceCommand._getCasinoValue(casino, 'wins'),
                    loses: BalanceCommand._getCasinoValue(casino, 'loses'),
                    uniqueItemsLength: StringUtils.toFormattedNumber(uniqueItemsLength),
                    itemsLength: StringUtils.toFormattedNumber(itemsLength)
                }
            }
        )
    }
}