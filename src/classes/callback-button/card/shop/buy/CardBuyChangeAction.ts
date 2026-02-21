import { ButtonScrollerOptions, ButtonScrollerFullOptions, ButtonScrollerEditMessageResult, CallbackButtonValue, TinyCurrentIncreaseId } from '../../../../../utils/values/types/types'
import ButtonScrollerAction from '../../../scrollers/button/ButtonScrollerAction'
import ShopCardService from '../../../../db/services/card/ShopCardService'
import FileUtils from '../../../../../utils/FileUtils'
import CardService from '../../../../db/services/card/CardService'
import ShopCard from '../../../../../interfaces/schemas/card/ShopCard'
import { UNKNOWN_CARD_TITLE } from '../../../../../utils/values/consts'
import StringUtils from '../../../../../utils/StringUtils'
import CardUtils from '../../../../../utils/CardUtils'

type Data = TinyCurrentIncreaseId
type Object = ShopCard

export default class extends ButtonScrollerAction<Object, Data> {
    protected _filename: string = 'cards/buy-change'
    protected _buttonTitle?: string | undefined = "Покупка карты: Пролистывание"

    constructor () {
        super()
        this._name = 'cbych'
    }

    protected async _getObjects({
        chatId,
    }: ButtonScrollerOptions<Data>): Promise<Object[]> {
        const result = await ShopCardService.getAllByChat(chatId)

        return result
    }

    protected async _editText({
        slicedObjects,
        data,
        id,
    }: ButtonScrollerFullOptions<Object, Data>): Promise<ButtonScrollerEditMessageResult> {
        const cards = await CardService.getAvailable()
        const values = slicedObjects.map<CallbackButtonValue>(({
            card: cardId,
            id: shopId,
            price
        }) => {
            const card = cards.find(({ id }) => id == cardId)
            const name = card?.name ?? UNKNOWN_CARD_TITLE
            const rarityEmoji = CardUtils.getEmoji(card?.rarity ?? CardUtils.unknownRarity)
            
            const formattedPrice = StringUtils.toFormattedNumber(price)
            const text = `(${formattedPrice}💰) ${rarityEmoji}${name}`

            return {
                text,
                data: JSON.stringify({ s: shopId, p: this._getNewPage(data), id })
            }
        })

        return {
            text: await FileUtils.readPugFromResource(
                'text/commands/cards/shop/buy-change.pug'
            ),
            values: {
                values: {
                    card: values
                }
            }
        }
    }
}