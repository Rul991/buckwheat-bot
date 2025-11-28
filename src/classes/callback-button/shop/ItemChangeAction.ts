import ContextUtils from '../../../utils/ContextUtils'
import ShopItems from '../../../utils/ShopItems'
import { AsyncOrSync, CallbackButtonContext, ShopItemWithLength, ScrollerEditMessageResult, ScrollerSendMessageOptions } from '../../../utils/values/types/types'
import ScrollerAction from '../scrollers/page/ScrollerAction'
import LinkedChatService from '../../db/services/linkedChat/LinkedChatService'
import PremiumChatService from '../../db/services/chat/PremiumChatService'

export default class ItemChangeAction extends ScrollerAction<ShopItemWithLength> {
    constructor() {
        super()
        this._name = 'itemchange'
    }

    protected _getObjects(_: CallbackButtonContext): AsyncOrSync<ShopItemWithLength[]> {
        return []
    }

    protected _getLength(_ctx: CallbackButtonContext, _objects: ShopItemWithLength[]): AsyncOrSync<number> {
        return ShopItems.len()
    }

    protected async _editMessage(
        ctx: CallbackButtonContext, 
        {
            data,
            currentPage: index,
            length
        }: ScrollerSendMessageOptions<ShopItemWithLength>
    ): Promise<ScrollerEditMessageResult> {
        const [userId, count] = data.split('_')
            .slice(2)
            .map(v => +v)
        if(await ContextUtils.showAlertIfIdNotEqual(ctx, userId)) return null

        const chatId = await LinkedChatService.getCurrent(ctx, userId)
        if(!chatId) return null

        const hasPremium = await PremiumChatService.isPremium(chatId)
        return await ShopItems.getShopMessage({
            index,
            chatId,
            userId,
            count,
            hasPremium
        })
    }
}