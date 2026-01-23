import { number, object, ZodType } from 'zod'
import { CallbackButtonOptions } from '../../../utils/values/types/action-options'
import CallbackButtonAction from '../CallbackButtonAction'
import GeneratorsService from '../../db/services/generators/GeneratorsService'
import ContextUtils from '../../../utils/ContextUtils'
import MessageUtils from '../../../utils/MessageUtils'
import FileUtils from '../../../utils/FileUtils'
import InlineKeyboardManager from '../../main/InlineKeyboardManager'
import { idSchema } from '../../../utils/values/schemas'

type Data = {
    id: number
    p: number
}

export default class extends CallbackButtonAction<Data> {
    protected _buttonTitle?: string | undefined = "Генератор: Добавить"
    protected _schema: ZodType<Data> = idSchema
        .and(object({
            p: number()
        }))

    constructor() {
        super()
        this._name = 'ga'
    }

    async execute(options: CallbackButtonOptions<Data>): Promise<string | void> {
        const {
            ctx,
            chatId,
            data: {
                id,
                p: page
            }
        } = options
        if(await ContextUtils.showAlertIfIdNotEqual(ctx, id)) return

        const {
            done,
            reason,
            count 
        } = await GeneratorsService.add(chatId, id)

        if(done) {
            await MessageUtils.editText(
                ctx,
                await FileUtils.readPugFromResource(
                    `text/commands/generator/add/added.pug`,
                    {
                        changeValues: {
                            count
                        }
                    }
                ),
                {
                    reply_markup: {
                        inline_keyboard: await InlineKeyboardManager.get(
                            'generator/update',
                            {
                                id: JSON.stringify(id),
                                page
                            }
                        )
                    }
                }
            )
        }
        else {
            await ContextUtils.showAlertFromFile(
                ctx,
                `text/commands/generator/add/${reason}.pug`
            )
        }
    }
}