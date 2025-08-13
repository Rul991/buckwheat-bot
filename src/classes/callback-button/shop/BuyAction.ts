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

export default class BuyAction extends CallbackButtonAction {
    constructor() {
        super()
        this._name = 'buy'
    }

    async execute(ctx: CallbackButtonContext, data: string): Promise<void> {
        const length = ShopItems.len()
        const [index, userId] = data
            .split('_')
            .map(val => +val)

        if(index === -1) return
        if(userId != ctx.from.id) {
            ContextUtils.showAlert(ctx)
            return
        }
        
        const item = ShopItems.getWithLength(index, length)!
        const money = await CasinoGetService.getMoney(userId)
        const user = await ContextUtils.getUser(userId)

        if(item.price > money) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/shop/no-money.pug',
                {
                    changeValues: {
                        ...item, 
                        elapsedMoney: item.price - money,
                        user
                    }
                }
            )
            return
        }

        const isBought = await item.execute(ctx, user)

        if(isBought) {
            await CasinoAddService.addMoney(userId, -item.price)
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