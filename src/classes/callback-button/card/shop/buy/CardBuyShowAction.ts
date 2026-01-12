import { ZodType } from 'zod'
import CallbackButtonAction from '../../../CallbackButtonAction'
import ContextUtils from '../../../../../utils/ContextUtils'
import CardUtils from '../../../../../utils/CardUtils'
import CardService from '../../../../db/services/card/CardService'
import MessageUtils from '../../../../../utils/MessageUtils'
import ShopCardService from '../../../../db/services/card/ShopCardService'
import FileUtils from '../../../../../utils/FileUtils'
import StringUtils from '../../../../../utils/StringUtils'
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

    constructor() {
        super()
        this._name = 'cbysh'
    }

    async execute({ctx, data}: CallbackButtonOptions<Data>): Promise<string | void> {
        const {
            id,
            s: shopId,
            p: page
        } = data
        if(await ContextUtils.showAlertIfIdNotEqual(ctx, id)) return

        const shopCard = await ShopCardService.get(shopId)
        if(!shopCard) return await FileUtils.readPugFromResource(
            'text/commands/cards/shop/no-shop-card.pug'
        )

        const {
            card: cardId,
            price,
            seller,
            chatId
        } = shopCard

        const card = await CardService.get(cardId)
        if(!card) return await FileUtils.readPugFromResource(
            'text/commands/cards/no-card.pug',
            {
                changeValues: {
                    id: cardId
                }
            }
        )

        const {
            text,
            media
        } = await CardUtils.getEditedMessage({
            card,
            currentPage: page,
            id,
            length: 0,
            inlineKeyboardFilename: 'buy-show',
            textFilename: 'shop/buy',
            changeValues: {
                price: StringUtils.toFormattedNumber(price),
                seller: await ContextUtils.getUser(chatId, seller)
            }
        })

        await MessageUtils.editMedia(
            ctx,
            {
                ...media!,
                caption: text
            },
            {
                reply_markup: {
                    inline_keyboard: await InlineKeyboardManager.get(
                        `cards/buy-show`,
                        {
                            page,
                            id,
                            shopId
                        })
                }
            }
        )
    }
}