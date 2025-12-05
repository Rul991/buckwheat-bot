import { JSONSchemaType } from 'ajv'
import { ButtonScrollerOptions, ButtonScrollerFullOptions, ButtonScrollerEditMessageResult, CurrentIncreaseIdNames, CallbackButtonValue, TinyCurrentIncreaseId } from '../../../../../utils/values/types/types'
import ButtonScrollerAction from '../../../scrollers/button/ButtonScrollerAction'
import ShopCardService from '../../../../db/services/card/ShopCardService'
import FileUtils from '../../../../../utils/FileUtils'
import CardService from '../../../../db/services/card/CardService'
import ShopCard from '../../../../../interfaces/schemas/card/ShopCard'
import { tinyCurrentIncreaseIdSchema } from '../../../../../utils/values/schemas'
import { UNKNOWN_CARD_TITLE } from '../../../../../utils/values/consts'

type Data = TinyCurrentIncreaseId

type Object = ShopCard

export default class extends ButtonScrollerAction<Object, Data> {
    protected _filename: string = 'cards/buy-change'
    protected _schema: JSONSchemaType<Data> = tinyCurrentIncreaseIdSchema

    constructor () {
        super()
        this._name = 'cbych'
    }

    protected _getCurrentIncreaseIdNames(): CurrentIncreaseIdNames<Data> {
        return {
            current: 'c',
            increase: 'i',
            id: 'id'
        }
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
            id: shopId
        }) => {
            const card = cards.find(({ id }) => id == cardId)
            const name = card?.name ?? UNKNOWN_CARD_TITLE
            return {
                text: name,
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