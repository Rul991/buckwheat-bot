import ContextUtils from '../../../utils/ContextUtils'
import FileUtils from '../../../utils/FileUtils'
import ShopItems from '../../../utils/ShopItems'
import { AsyncOrSync, CallbackButtonContext, RequiredShopItemWithLength, ScrollerEditMessageResult, ScrollerSendMessageOptions } from '../../../utils/values/types'
import InlineKeyboardManager from '../../main/InlineKeyboardManager'
import StringUtils from '../../../utils/StringUtils'
import ScrollerAction from '../scrollers/ScrollerAction'

export default class ItemChangeAction extends ScrollerAction<RequiredShopItemWithLength> {
    constructor() {
        super()
        this._name = 'itemchange'
    }

    protected _getObjects(_: CallbackButtonContext): AsyncOrSync<RequiredShopItemWithLength[]> {
        return []
    }

    protected _getLength(_ctx: CallbackButtonContext, _objects: RequiredShopItemWithLength[]): AsyncOrSync<number> {
        return ShopItems.len()
    }

    protected async _editMessage(
        ctx: CallbackButtonContext, 
        {
            data,
            currentPage: index,
            length
        }: ScrollerSendMessageOptions<RequiredShopItemWithLength>
    ): Promise<ScrollerEditMessageResult> {
        const item = await ShopItems.get(index)
        if(!item) return await FileUtils.readPugFromResource('text/alerts/wrong-item.pug')

        const [userId, count] = data.split('_')
            .slice(2)
            .map(v => +v)

        if(userId != ctx.from.id) {
            ContextUtils.showAlertFromFile(ctx)
            return null
        }

        const totalCount = ShopItems.getCount(item, count)
        const totalPrice = ShopItems.getFormattedPriceByCount(item, count)

        return {
            text: await FileUtils.readPugFromResource(
                'text/commands/shop/shop.pug',
                {
                    changeValues: {
                        ...item,
                        count: StringUtils.toFormattedNumber(totalCount),
                        price: StringUtils.toFormattedNumber(item.price),
                        totalPrice,
                        index,
                        length
                    }
                }
            ),
            options: {
                reply_markup: {
                    inline_keyboard: await InlineKeyboardManager.get('shop', `${index}_${userId}_${count}`)
                },
            }
        }
    }
}