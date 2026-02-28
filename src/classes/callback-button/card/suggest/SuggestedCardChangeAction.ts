import Card from '../../../../interfaces/schemas/card/Card'
import CardUtils from '../../../../utils/CardUtils'
import ContextUtils from '../../../../utils/ContextUtils'
import { ScrollerGetObjectsOptions, AsyncOrSync, ScrollerSendMessageOptions, ScrollerEditMessageResult } from '../../../../utils/values/types/types'
import { CallbackButtonContext } from '../../../../utils/values/types/contexts'
import CardService from '../../../db/services/card/CardService'
import LegacyScrollerAction from '../../scrollers/page/LegacyScrollerAction'

type Data = Card

export default class extends LegacyScrollerAction<Data> {
    protected _buttonTitle?: string | undefined = "Предложение карты: Пролистывание"
    constructor() {
        super()
        this._name = 'csush'
        this._objectsPerPage = 1
    }
    
    protected async _getObjects(_: CallbackButtonContext, { }: ScrollerGetObjectsOptions): Promise<Data[]> {
        return await CardService.getSuggested()
    }

    protected _getId(_: CallbackButtonContext, data: string): AsyncOrSync<number> {
        return +data.split('_')[2]
    }

    protected async _editMessage(ctx: CallbackButtonContext, options: ScrollerSendMessageOptions<Data>): Promise<ScrollerEditMessageResult> {
        const {
            objects: [card],
            currentPage,
            id,
            length
        } = options

        if(await ContextUtils.showAlertIfIdNotEqual(ctx, id)) return null

        return await CardUtils.getEditedMessage({
            card,
            id,
            length,
            currentPage,
            inlineKeyboardFilename: 'suggest'
        })
    }
}