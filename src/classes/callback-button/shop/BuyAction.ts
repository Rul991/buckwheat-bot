import ContextUtils from '../../../utils/ContextUtils'
import ShopItems from '../../../utils/ShopItems'
import MessageUtils from '../../../utils/MessageUtils'
import { CallbackButtonContext } from '../../../utils/values/types'
import CasinoAddService from '../../db/services/casino/CasinoAddService'
import CasinoGetService from '../../db/services/casino/CasinoGetService'
import CallbackButtonAction from '../CallbackButtonAction'
import StringUtils from '../../../utils/StringUtils'
import FileUtils from '../../../utils/FileUtils'

export default class BuyAction extends CallbackButtonAction {
    constructor() {
        super()
        this._name = 'buy'
    }

    async execute(ctx: CallbackButtonContext, data: string): Promise<string | void> {
        const [index] = data
            .split('_', 1)
            .map(val => +val)

        if(index === -1) return
        
        const item = await ShopItems.getWithLength(index)
        if(!item) return 'Что то пошло не так!'

        const money = await CasinoGetService.getMoney(ctx.from.id)
        const user = await ContextUtils.getUserFromContext(ctx)

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

        const isBought = await item.execute(ctx, user, item)

        if(isBought) {
            await CasinoAddService.addMoney(ctx.from.id, -item.price)
            await CasinoAddService.addMoney(ctx.botInfo.id, item.price)
            return `Товар "${item.name}" куплен!`
        }
        else {
            return await FileUtils.readPugFromResource('text/commands/shop/return.pug')
        }
    }
}