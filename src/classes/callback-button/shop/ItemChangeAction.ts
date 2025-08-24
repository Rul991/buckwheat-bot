import { PARSE_MODE } from '../../../utils/values/consts'
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
        const userId = +data.split('_')[2]

        if(index === -1) return
        if(userId != ctx.from.id) {
            ContextUtils.showCallbackMessageFromFile(ctx)
            return
        }
        
        const item = await ShopItems.getWithLength(index)
        if(!item) return 'Что то пошло не так!'

        await MessageUtils.editText(
            ctx,
            await FileUtils.readPugFromResource(
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