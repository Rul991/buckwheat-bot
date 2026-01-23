import { number, object, string, ZodType } from 'zod'
import CallbackButtonAction from '../CallbackButtonAction'
import FaqUtils from '../../../utils/FaqUtils'
import FileUtils from '../../../utils/FileUtils'
import MessageUtils from '../../../utils/MessageUtils'
import InlineKeyboardManager from '../../main/InlineKeyboardManager'
import { CallbackButtonOptions } from '../../../utils/values/types/action-options'

type Data = {
    n: string,
    p: number
}

export default class extends CallbackButtonAction<Data> {
    protected _buttonTitle?: string | undefined = "FAQ: Просмотр"
    protected _schema: ZodType<Data> = object({
        n: string(),
        p: number()
    })

    constructor() {
        super()
        this._name = 'faq'
    }

    async execute({ctx, data}: CallbackButtonOptions<Data>): Promise<string | void> {
        const {
            n: name,
            p: page
        } = data

        const text = await FaqUtils.getText(name)

        if(text.length == 0) return await FileUtils.readPugFromResource(
            'text/actions/faq/no.pug'
        )

        await MessageUtils.editText(
            ctx,
            text,
            {
                reply_markup: {
                    inline_keyboard: await InlineKeyboardManager.get(
                        'faq/back',
                        {
                            page: JSON.stringify(page)
                        }
                    )
                }
            }
        )
    }

}