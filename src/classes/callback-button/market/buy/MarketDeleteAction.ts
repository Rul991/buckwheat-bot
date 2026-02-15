import { number, object, string, ZodType } from 'zod'
import CallbackButtonAction from '../../CallbackButtonAction'
import { CallbackButtonOptions } from '../../../../utils/values/types/action-options'
import MarketSlotService from '../../../db/services/market/MarketSlotService'
import FileUtils from '../../../../utils/FileUtils'
import ContextUtils from '../../../../utils/ContextUtils'
import MessageUtils from '../../../../utils/MessageUtils'
import LegacyInlineKeyboardManager from '../../../main/LegacyInlineKeyboardManager'

type Data = {
    page: number
    slot: number
    itemId?: string
}

export default class extends CallbackButtonAction<Data> {
    protected _schema: ZodType<Data> = object({
        page: number(),
        slot: number(),
        itemId: string().optional()
    })

    constructor() {
        super()
        this._name = 'marketdelete'
        this._buttonTitle = 'Рынок: Удалить слот'
    }

    async execute(options: CallbackButtonOptions<Data>): Promise<string | void> {
        const {
            ctx,
            data
        } = options

        const {
            slot: slotId,
            page,
            itemId
        } = data

        const slot = await MarketSlotService.get(
            slotId
        )
        if(!slot) {
            return await FileUtils.readPugFromResource(
                'text/commands/market/alert/no-slot.pug'
            )
        }
        const {
            userId: owner
        } = slot
        if(await ContextUtils.showAlertIfIdNotEqual(ctx, owner)) return

        await MarketSlotService.delete(slotId)
        await MessageUtils.editTextFromResource(
            ctx,
            'text/commands/market/alert/delete.pug',
            {
                inlineKeyboard: await LegacyInlineKeyboardManager.get(
                    'market/after-buy',
                    {
                        page,
                        id: owner,
                        itemId: JSON.stringify({
                            itemId
                        })
                    }
                )
            }
        )

        return await FileUtils.readPugFromResource(
            'text/commands/market/alert/delete.pug'
        )
    }
}