import ContextUtils from '../../../utils/ContextUtils'
import FileUtils from '../../../utils/FileUtils'
import ShopItems from '../../../utils/ShopItems'
import MessageUtils from '../../../utils/MessageUtils'
import Pager from '../../../utils/Pager'
import { AsyncOrSync, CallbackButtonContext, RequiredShopItemWithLength, ScrollerEditMessageResult, ScrollerSendMessageOptions } from '../../../utils/values/types'
import CallbackButtonManager from '../../main/CallbackButtonManager'
import CallbackButtonAction from '../CallbackButtonAction'
import StringUtils from '../../../utils/StringUtils'
import ScrollerAction from '../scrollers/ScrollerAction'

export class ItemChangeAction1 extends CallbackButtonAction {
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
        
        const item = await ShopItems.get(index)
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
                    inline_keyboard: await CallbackButtonManager.get('shop', `${index}_${ctx.from.id}_${count}`)
                },
            }
        )
    }
}

export default class ItemChangeAction extends ScrollerAction<RequiredShopItemWithLength> {
    constructor() {
        super()
        this._name = 'itemchange'
    }

    protected _getObjects(ctx: CallbackButtonContext): AsyncOrSync<RequiredShopItemWithLength[]> {
        return []
    }

    protected _getLength(ctx: CallbackButtonContext, objects: RequiredShopItemWithLength[]): AsyncOrSync<number> {
        return ShopItems.len()
    }

    protected async _editMessage(
        ctx: CallbackButtonContext, 
        {
            data,
            currentPage: index,
            length
        }: ScrollerSendMessageOptions<RequiredShopItemWithLength>
    ): Promise<ScrollerEditMessageResult | string | null> {
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
                    inline_keyboard: await CallbackButtonManager.get('shop', `${index}_${userId}_${count}`)
                },
            }
        }
    }
}