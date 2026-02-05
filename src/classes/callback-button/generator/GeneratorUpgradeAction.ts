import { ZodType, object, number } from 'zod'
import ContextUtils from '../../../utils/ContextUtils'
import FileUtils from '../../../utils/FileUtils'
import { idSchema } from '../../../utils/values/schemas'
import { CallbackButtonOptions } from '../../../utils/values/types/action-options'
import GeneratorsService from '../../db/services/generators/GeneratorsService'
import CallbackButtonAction from '../CallbackButtonAction'
import MessageUtils from '../../../utils/MessageUtils'
import LegacyInlineKeyboardManager from '../../main/LegacyInlineKeyboardManager'

type Data = {
    id: number
    i: number
    p: number
    l: number
}

export default class extends CallbackButtonAction<Data> {
    protected _buttonTitle?: string | undefined = "Генератор: Улучшение"
    protected _schema: ZodType<Data> | null = idSchema
        .and(object({
            i: number(),
            p: number(),
            l: number(),
        }))

    constructor () {
        super()
        this._name = 'gu'
    }

    async execute(options: CallbackButtonOptions<Data>): Promise<string | void> {
        const {
            ctx,
            chatId,
            data
        } = options

        const {
            id,
            i: index,
            p: page,
            l: level
        } = data

        if (await ContextUtils.showAlertIfIdNotEqual(ctx, id)) return

        const {
            done,
            reason
        } = await GeneratorsService.upgrade({
            chatId, 
            id, 
            generatorId: index, 
            level
        })
        const path = `text/commands/generator/upgrade/${reason}.pug`

        if (done) {
            await MessageUtils.editMarkup(
                ctx,
                {
                    inline_keyboard: await LegacyInlineKeyboardManager.get(
                        'generator/gen-update',
                        {
                            id,
                            page,
                            index
                        }
                    )
                }
            )

            return await FileUtils.readPugFromResource(
                path
            )
        }
        else {
            await ContextUtils.showAlertFromFile(
                ctx,
                path
            )
        }
    }
}