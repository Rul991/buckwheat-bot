import ContextUtils from '../../../utils/ContextUtils'
import ShopItems from '../../../utils/ShopItems'
import MessageUtils from '../../../utils/MessageUtils'
import { CallbackButtonContext } from '../../../utils/values/types'
import CasinoAddService from '../../db/services/casino/CasinoAddService'
import CasinoGetService from '../../db/services/casino/CasinoGetService'
import CallbackButtonAction from '../CallbackButtonAction'
import StringUtils from '../../../utils/StringUtils'
import FileUtils from '../../../utils/FileUtils'
import InventoryItemService from '../../db/services/items/InventoryItemService'

export default class BuyAction extends CallbackButtonAction {
    constructor() {
        super()
        this._name = 'buy'
    }

    async execute(ctx: CallbackButtonContext, data: string): Promise<string | void> {
        const [index, _id, count] = data
            .split('_')
            .map(val => +val)

        if(index === -1) return
        
        const item = await ShopItems.getWithLength(index)
        if(!item) return await FileUtils.readPugFromResource('text/alerts/wrong-item.pug')

        const money = await CasinoGetService.getMoney(ctx.from.id)
        const user = await ContextUtils.getUserFromContext(ctx)

        const totalCount = ShopItems.getCount(item, count)
        const totalPrice = totalCount * item.price

        if(totalPrice > money) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/shop/no-money.pug',
                {
                    changeValues: {
                        name: item.name, 
                        elapsedMoney: StringUtils.toFormattedNumber(totalPrice - money),
                        user
                    }
                }
            )
            return
        }

        const isBought = await item.execute({
            ctx, 
            user, 
            item, 
            count: totalCount,
        })

        if(isBought) {
            const itemId = 'shopPrecent'
            const owners = await InventoryItemService.getOwners(itemId)
            let precents = 100

            for await (const {id, count} of owners) {
                precents -= count
                await CasinoAddService.addMoney(id, Math.floor(totalPrice * (count / 100)))
            }

            await CasinoAddService.addMoney(ctx.botInfo.id, Math.ceil(totalPrice * (precents / 100)))
            await CasinoAddService.addMoney(ctx.from.id, -totalPrice)

            return await FileUtils.readPugFromResource(
                'text/alerts/bought.pug',
                {
                    changeValues: item
                }
            )
        }
        else {
            return await FileUtils.readPugFromResource('text/commands/shop/return.pug')
        }
    }
}