import InventoryCard from '../../../../../interfaces/schemas/card/InventoryCard'
import { ButtonScrollerEditMessageResult, ButtonScrollerFullOptions, ButtonScrollerOptions, TinyCurrentIncreaseId } from '../../../../../utils/values/types/types'
import CardsService from '../../../../db/services/card/CardsService'
import ButtonScrollerAction from '../../../scrollers/button/ButtonScrollerAction'
import CardService from '../../../../db/services/card/CardService'
import { UNKNOWN_CARD_TITLE } from '../../../../../utils/values/consts'
import FileUtils from '../../../../../utils/FileUtils'

type Object = InventoryCard
type Data = TinyCurrentIncreaseId

export default class extends ButtonScrollerAction<Object, Data> {
    protected _filename: string = 'cards/sell-change'

    constructor () {
        super()
        this._name = 'csech'
    }

    protected async _getObjects({
        id,
        chatId
    }: ButtonScrollerOptions<TinyCurrentIncreaseId>): Promise<Object[]> {
        return await CardsService.getCards(chatId, id)
    }

    protected async _editText({
        slicedObjects,
        id: userId
    }: ButtonScrollerFullOptions<Object, TinyCurrentIncreaseId>): Promise<ButtonScrollerEditMessageResult> {
        const cardIdsTitles = await Promise.all(
            slicedObjects.map(async ({ id, count }) => {
                const card = await CardService.get(id)
                return {
                    id,
                    title: `${card?.name ?? UNKNOWN_CARD_TITLE} x${count}`
                }
            })
        )

        const cardButtons = cardIdsTitles
            .map(({ title, id }) => {
                return {
                    text: title,
                    data: JSON.stringify({ c: id, id: userId })
                }
            })

        return {
            text: await FileUtils.readPugFromResource(
                'text/commands/cards/shop/sell-change.pug'
            ),
            values: {
                values: {
                    card: cardButtons
                }
            }
        }
    }

}