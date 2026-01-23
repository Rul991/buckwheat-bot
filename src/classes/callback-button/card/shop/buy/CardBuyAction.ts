import { ZodType } from 'zod'
import CallbackButtonAction from '../../../CallbackButtonAction'
import ContextUtils from '../../../../../utils/ContextUtils'
import ShopCardService from '../../../../db/services/card/ShopCardService'
import MessageUtils from '../../../../../utils/MessageUtils'
import InlineKeyboardManager from '../../../../main/InlineKeyboardManager'
import { CallbackButtonOptions } from '../../../../../utils/values/types/action-options'
import { cardBuySchema } from '../../../../../utils/values/schemas'

type Data = {
    s: number
    id: number
    p: number
}

export default class extends CallbackButtonAction<Data> {
    protected _schema: ZodType<Data> = cardBuySchema
    protected _buttonTitle?: string | undefined = "Покупка карты"

    constructor() {
        super()
        this._name = 'cbuy'
    }

    async execute({ctx, data}: CallbackButtonOptions<Data>): Promise<string | void> {
        const {
            id,
            s: shopCardId,
            p: page
        } = data
        if(await ContextUtils.showAlertIfIdNotEqual(ctx, id)) return

        const {
            isBought,
            reason
        } = await ShopCardService.buy(shopCardId, id)

        if(isBought) {
            await MessageUtils.editMarkup(
                ctx,
                {
                    inline_keyboard: await InlineKeyboardManager.get(
                        'cards/to-buy',
                        {
                            page: `${page}`,
                            id: `${id}`,
                        }
                    )
                }
            )
        }

        await ContextUtils.showCallbackMessageFromFile(
            ctx, 
            `text/commands/cards/shop/reasons/${reason}.pug`
        )
    }
}