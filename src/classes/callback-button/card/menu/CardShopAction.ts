import { number, object, ZodType } from 'zod'
import CallbackButtonAction from '../../CallbackButtonAction'
import ContextUtils from '../../../../utils/ContextUtils'
import MessageUtils from '../../../../utils/MessageUtils'
import InlineKeyboardManager from '../../../main/InlineKeyboardManager'
import FileUtils from '../../../../utils/FileUtils'
import { CallbackButtonOptions } from '../../../../utils/values/types/action-options'
import { idSchema } from '../../../../utils/values/schemas'

type Data = {
    id: number
}

export default class extends CallbackButtonAction<Data> {
    protected _buttonTitle?: string | undefined = "Карты: Магазин"
    protected _schema: ZodType<Data> = idSchema

    constructor() {
        super()
        this._name = 'cshp'
    }

    async execute({ctx, data}: CallbackButtonOptions<Data>): Promise<string | void> {
        const {
            id
        } = data
        if(await ContextUtils.showAlertIfIdNotEqual(ctx, id)) return

        await MessageUtils.editText(
            ctx,
            await FileUtils.readPugFromResource(
                'text/commands/cards/shop/type-choose.pug'
            ),
            {
                reply_markup: {
                    inline_keyboard: await InlineKeyboardManager.get(
                        'cards/shop',
                        {
                            data: JSON.stringify({id, c: -1, i: 1})
                        }
                    )
                }
            }
        )
    }
}