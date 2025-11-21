import ContextUtils from '../../../utils/ContextUtils'
import FileUtils from '../../../utils/FileUtils'
import ShopItems from '../../../utils/ShopItems'
import { AsyncOrSync, CallbackButtonContext, ShopItemWithLength, ScrollerEditMessageResult, ScrollerSendMessageOptions } from '../../../utils/values/types'
import InlineKeyboardManager from '../../main/InlineKeyboardManager'
import StringUtils from '../../../utils/StringUtils'
import ScrollerAction from '../scrollers/page/ScrollerAction'
import LinkedChatService from '../../db/services/linkedChat/LinkedChatService'

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

        return await ShopItems.getShopMessage({
            index,
            chatId,
            userId,
            count
        })
    }
}