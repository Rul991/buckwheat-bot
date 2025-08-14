import { PARSE_MODE } from '../../../utils/consts'
import ContextUtils from '../../../utils/ContextUtils'
import FileUtils from '../../../utils/FileUtils'
import ShopItems from '../../../utils/ShopItems'
import MessageUtils from '../../../utils/MessageUtils'
import Pager from '../../../utils/Pager'
import { CallbackButtonContext } from '../../../utils/types'
import InlineKeyboardManager from '../../main/InlineKeyboardManager'
import CallbackButtonAction from '../CallbackButtonAction'
import StringUtils from '../../../utils/StringUtils'

export default class ItemChangeAction extends CallbackButtonAction {
    constructor() {
        super()
        this._name = 'itemchange'
    }

    async execute(ctx: CallbackButtonContext, data: string): Promise<void> {
        const length = ShopItems.len()
        const index = Pager.clampPages(data, length)
        const userId = +data.split('_')[2]

        if(index === -1) return
        if(userId != ctx.from.id) {
            ContextUtils.showAlert(ctx)
            return
        }
        
        const item = ShopItems.getWithLength(index, length)!

        await MessageUtils.editText(
            ctx,
            await FileUtils.readTextFromResource(
                'text/commands/shop/shop.pug',
                {
                    changeValues: {
                        ...item,
                        price: StringUtils.toFormattedNumber(item.price)
                    }
                }
            ),
            {
                reply_markup: {
                    inline_keyboard: await InlineKeyboardManager.get('shop', `${index}_${ctx.from.id}`)
                },
                parse_mode: PARSE_MODE
            }
        )
    }
}