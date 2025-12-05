import Card from '../../../../interfaces/schemas/card/Card'
import CardUtils from '../../../../utils/CardUtils'
import ContextUtils from '../../../../utils/ContextUtils'
import { CallbackButtonContext, ScrollerGetObjectsOptions, AsyncOrSync, ScrollerSendMessageOptions, ScrollerEditMessageResult } from '../../../../utils/values/types/types'
import CardService from '../../../db/services/card/CardService'
import LinkedChatService from '../../../db/services/linkedChat/LinkedChatService'
import ScrollerAction from '../../scrollers/page/ScrollerAction'

type Data = Card

export default class extends ScrollerAction<Data> {
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
        const chatId = await LinkedChatService.getCurrent(ctx, id)
        if(!chatId) return null

        return await CardUtils.getEditedMessage({
            card,
            id,
            length,
            currentPage,
            inlineKeyboardFilename: 'suggest'
        })
    }
}