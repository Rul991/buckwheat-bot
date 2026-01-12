import { number, object, ZodType } from 'zod'
import { CallbackButtonOptions } from '../../../utils/values/types/action-options'
import CallbackButtonAction from '../CallbackButtonAction'
import { idSchema } from '../../../utils/values/schemas'
import ContextUtils from '../../../utils/ContextUtils'
import GeneratorsService from '../../db/services/generators/GeneratorsService'
import GeneratorUtils from '../../../utils/GeneratorUtils'
import MessageUtils from '../../../utils/MessageUtils'
import InlineKeyboardManager from '../../main/InlineKeyboardManager'
import FileUtils from '../../../utils/FileUtils'

type Data = {
    id: number
    p: number
}

export default class extends CallbackButtonAction<Data> {
    protected _schema: ZodType<Data> | null = idSchema
        .and(object({
            p: number(),
        }))

    constructor() {
        super()
        this._name = 'gg'
    }

    async execute(options: CallbackButtonOptions<Data>): Promise<string | void> {
        const {
            ctx,
            chatId,
            data
        } = options

        const {
            id,
            p: page
        } = data

        if(await ContextUtils.showAlertIfIdNotEqual(ctx, id)) return

        const collectedMoney = await GeneratorsService.collectIncome(chatId, id)

        if(collectedMoney > 0) {
            const generator = await GeneratorsService.get(chatId, id)
            const text = await GeneratorUtils.getInfoMessage({
                chatId,
                id,
                generator
            })

            await MessageUtils.editText(
                ctx,
                text,
                {
                    reply_markup: {
                        inline_keyboard: await InlineKeyboardManager.get(
                            'generator/update',
                            {
                                id,
                                page
                            }
                        )
                    }
                }
            )
        }

        return await FileUtils.readPugFromResource(
            'text/commands/generator/collect.pug',
            {
                changeValues: {
                    money: collectedMoney
                }
            }
        )
    }
}