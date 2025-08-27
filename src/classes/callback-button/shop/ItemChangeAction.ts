import ContextUtils from '../../../utils/ContextUtils'
import FileUtils from '../../../utils/FileUtils'
import ShopItems from '../../../utils/ShopItems'
import MessageUtils from '../../../utils/MessageUtils'
import Pager from '../../../utils/Pager'
import { CallbackButtonContext } from '../../../utils/values/types'
import InlineKeyboardManager from '../../main/InlineKeyboardManager'
import CallbackButtonAction from '../CallbackButtonAction'
import StringUtils from '../../../utils/StringUtils'

export default class ItemChangeAction extends CallbackButtonAction {
    constructor() {
        super()
        this._name = 'itemchange'
    }

    async execute(ctx: CallbackButtonContext, data: string): Promise<string | void> {
        const length = ShopItems.len()
        const index = Pager.wrapPages(data, length)

        const [userId, count] = data.split('_')
            .slice(2)
            .map(v => +v)

        if(index === -1) return
        if(userId != ctx.from.id) {
            ContextUtils.showAlertFromFile(ctx)
            return
        }
        
        const item = await ShopItems.getWithLength(index)
        if(!item) return await FileUtils.readPugFromResource('text/alerts/wrong-item.pug')

        const totalCount = ShopItems.getCount(item, count)
        const totalPrice = ShopItems.getFormattedPriceByCount(item, count)

        await MessageUtils.editText(
            ctx,
            await FileUtils.readPugFromResource(
                'text/commands/shop/shop.pug',
                {
                    changeValues: {
                        ...item,
                        count: StringUtils.toFormattedNumber(totalCount),
                        price: StringUtils.toFormattedNumber(item.price),
                        totalPrice,
                    }
                }
            ),
            {
                reply_markup: {
                    inline_keyboard: await InlineKeyboardManager.get('shop', `${index}_${ctx.from.id}_${count}`)
                },
            }
        )
    }
}