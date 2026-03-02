import { object, string, ZodType } from 'zod'
import CallbackButtonAction from '../CallbackButtonAction'
import { idSchema } from '../../../utils/values/schemas'
import { CallbackButtonOptions } from '../../../utils/values/types/action-options'
import ContextUtils from '../../../utils/ContextUtils'
import SelectedGunService from '../../db/services/gun/SelectedGunService'
import MessageUtils from '../../../utils/MessageUtils'
import InventoryItemsUtils from '../../../utils/InventoryItemsUtils'

type Data = {
    id: number
    item?: string
}

export default class extends CallbackButtonAction<Data> {
    protected _schema: ZodType<Data> = idSchema
        .and(object({
            item: string().optional()
        }))

    constructor() {
        super()
        this._name = 'selectgun'
        this._buttonTitle = 'Оружие: Выбрать'
    }

    async execute(options: CallbackButtonOptions<Data>): Promise<string | void> {
        const {
            ctx,
            chatId,
            data
        } = options

        const {
            id,
            item: itemId
        } = data

        if(await ContextUtils.showAlertIfIdNotEqual(ctx, id)) return

        await SelectedGunService.set(
            chatId,
            id,
            itemId
        )

        await MessageUtils.editTextFromResource(
            ctx,
            'text/commands/gun/selected.pug',
            {
                changeValues: {
                    item: itemId && InventoryItemsUtils.getItemDescription(itemId)
                }
            }
        )
    }
}