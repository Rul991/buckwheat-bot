import { DEFAULT_USER_NAME } from '../../../utils/consts'
import ContextUtils from '../../../utils/ContextUtils'
import ShopItems from '../../../utils/ShopItems'
import MessageUtils from '../../../utils/MessageUtils'
import Pager from '../../../utils/Pager'
import { CallbackButtonContext } from '../../../utils/types'
import CasinoAddService from '../../db/services/casino/CasinoAddService'
import CasinoGetService from '../../db/services/casino/CasinoGetService'
import UserNameService from '../../db/services/user/UserNameService'
import CallbackButtonAction from '../CallbackButtonAction'
import StringUtils from '../../../utils/StringUtils'

export default class BuyAction extends CallbackButtonAction {
    constructor() {
        super()
        this._name = 'buy'
    }

    async execute(ctx: CallbackButtonContext, data: string): Promise<string | void> {
        const length = ShopItems.len()
        const [index] = data
            .split('_', 1)
            .map(val => +val)

        if(index === -1) return
        
        const item = ShopItems.getWithLength(index, length)!
        const money = await CasinoGetService.getMoney(ctx.from.id)
        const user = await ContextUtils.getUser(ctx.from.id)

        let priceString = StringUtils.toFormattedNumber(item.price)

        if(item.price > money) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/shop/no-money.pug',
                {
                    changeValues: {
                        ...item, 
                        elapsedMoney: item.price - money,
                        user,
                        price: priceString
                    }
                }
            )
            return
        }

        const isBought = await item.execute(ctx, user)

        if(isBought) {
            await CasinoAddService.addMoney(ctx.from.id, -item.price)
            await CasinoAddService.addMoney(ctx.botInfo.id, item.price)
            return `Товар "${item.name}" куплен!`
        }
        else {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/shop/return.pug',
                {
                    changeValues: {
                        ...item, 
                        user
                    }
                }
            )
        }
    }
}