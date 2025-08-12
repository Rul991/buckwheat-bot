import { DEFAULT_USER_NAME } from '../../../utils/consts'
import ContextUtils from '../../../utils/ContextUtils'
import Items from '../../../utils/Items'
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
        const length = Items.len()
        const [index, userId] = data
            .split('_')
            .map(val => +val)

        if(index === -1) return
        if(userId != ctx.from.id) {
            ContextUtils.showAlert(ctx)
            return
        }
        
        const item = Items.getWithLength(index, length)!
        const money = await CasinoGetService.getMoney(userId)

        if(item.price > money) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/shop/no-money.pug',
                {
                    changeValues: {
                        ...item, 
                        elapsedMoney: item.price - money,
                        user: {
                            name: await UserNameService.get(userId) ?? DEFAULT_USER_NAME,
                            link: ContextUtils.getLinkUrl(userId)
                        }
                    }
                }
            )
            return
        }

        await CasinoAddService.addMoney(userId, -item.price)
        await item.execute(ctx)
    }
}