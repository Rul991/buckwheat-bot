import { number, object, string, ZodType } from 'zod'
import { CallbackButtonOptions } from '../../../utils/values/types/action-options'
import CallbackButtonAction from '../CallbackButtonAction'
import { idSchema } from '../../../utils/values/schemas'
import ContextUtils from '../../../utils/ContextUtils'
import InventoryItemService from '../../db/services/items/InventoryItemService'
import FileUtils from '../../../utils/FileUtils'
import MessageUtils from '../../../utils/MessageUtils'
import LegacyInlineKeyboardManager from '../../main/LegacyInlineKeyboardManager'
import InventoryItemsUtils from '../../../utils/InventoryItemsUtils'

type Data = {
    id: number
    page: number
    itemId: string
}

export default class extends CallbackButtonAction<Data> {
    protected _schema: ZodType<Data> = idSchema
        .and(object({
            itemId: string(),
            page: number()
        }))

    constructor() {
        super()
        this._name = 'invshow'
        this._buttonTitle = 'Инвентарь: Просмотр'
    }
    async execute(options: CallbackButtonOptions<Data>): Promise<string | void> {
        const {
            chatId,
            data,
            ctx,
        } = options

        const {
            id,
            itemId,
            page
        } = data

        if(await ContextUtils.showAlertIfIdNotEqual(ctx, id)) return

        const item = await InventoryItemService.showItem(
            chatId,
            id,
            itemId
        )

        const chance = InventoryItemsUtils.getChancePrecents(itemId)
        const text = await FileUtils.readPugFromResource(
            'text/commands/inventory/show.pug',
            {
                changeValues: {
                    item,
                    chance
                }
            }
        )

        await MessageUtils.editText(
            ctx,
            text,
            {
                reply_markup: {
                    inline_keyboard: await LegacyInlineKeyboardManager.get(
                        'inventory/show',
                        {
                            id,
                            page,
                            itemId: JSON.stringify(itemId)
                        }
                    )
                }
            }
        )
    }
}