import InventoryCard from '../../../../interfaces/schemas/card/InventoryCard'
import CardUtils from '../../../../utils/CardUtils'
import ContextUtils from '../../../../utils/ContextUtils'
import { ScrollerGetObjectsOptions, ScrollerSendMessageOptions, ScrollerEditMessageResult, AsyncOrSync } from '../../../../utils/values/types/types'
import { CallbackButtonContext } from '../../../../utils/values/types/contexts'
import CardService from '../../../db/services/card/CardService'
import CardsService from '../../../db/services/card/CardsService'
import LegacyScrollerAction from '../../scrollers/page/LegacyScrollerAction'

type Data = InventoryCard

export default class extends LegacyScrollerAction<Data> {
    protected _buttonTitle?: string | undefined = "Карты: Пролистывание"

    constructor () {
        super()
        this._name = 'cshw'
        this._objectsPerPage = 1
    }

    protected async _getObjects(ctx: CallbackButtonContext, { id, chatId }: ScrollerGetObjectsOptions): Promise<Data[]> {
        return await CardsService.getCards(chatId, id)
    }

    protected _getId(ctx: CallbackButtonContext, data: string): AsyncOrSync<number> {
        return +data.split('_')[2]
    }

    protected async _editMessage(ctx: CallbackButtonContext, options: ScrollerSendMessageOptions<Data>): Promise<ScrollerEditMessageResult> {
        const {
            objects: [inventoryCard],
            currentPage,
            id,
            length
        } = options

        if (await ContextUtils.showAlertIfIdNotEqual(ctx, id)) return null

        const {
            id: cardId,
            count
        } = inventoryCard

        const card = await CardService.get(cardId) ?? CardUtils.getUnknown(false)

        return await CardUtils.getEditedMessage({
            card,
            count,
            id,
            length,
            currentPage,
            inlineKeyboardFilename: 'change'
        })
    }
}