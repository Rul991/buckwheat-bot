import { number, object, ZodType } from 'zod'
import { CallbackButtonOptions } from '../../../utils/values/types/action-options'
import CallbackButtonAction from '../CallbackButtonAction'
import ContextUtils from '../../../utils/ContextUtils'
import MessageUtils from '../../../utils/MessageUtils'
import LegacyInlineKeyboardManager from '../../main/LegacyInlineKeyboardManager'
import GeneratorsService from '../../db/services/generators/GeneratorsService'
import { GENERATOR_MAX_LEVEL } from '../../../utils/values/consts'
import FileUtils from '../../../utils/FileUtils'

type Data = {
    id: number,
    p: number
}

export default class extends CallbackButtonAction<Data> {
    protected _schema: ZodType<Data> = object({
        id: number(),
        p: number()
    })

    constructor () {
        super()
        this._name = 'gua'
        this._buttonTitle = 'Генератор: Улучшить все'
    }

    async execute(options: CallbackButtonOptions<Data>): Promise<string | void> {
        const {
            ctx,
            data,
            chatId
        } = options

        const {
            id,
            p: page
        } = data
        if (await ContextUtils.showAlertIfIdNotEqual(ctx, id)) return

        const upgradeResult = await GeneratorsService.upgradeAll({
            chatId,
            id,
            level: GENERATOR_MAX_LEVEL
        })
        const upgradedCount = upgradeResult.reduce(
            (total, { done }) => {
                if (done) {
                    return total + 1
                }

                return total
            },
            0
        )

        if (upgradedCount > 0) {
            await MessageUtils.editMarkup(
                ctx,
                {
                    inline_keyboard: await LegacyInlineKeyboardManager.get(
                        'generator/update',
                        {
                            id,
                            page
                        }
                    )
                }
            )
        }
        return await FileUtils.readPugFromResource(
            'text/commands/generator/upgrade/upgraded-all.pug',
            {
                changeValues: {
                    upgraded: upgradedCount
                }
            }
        )
    }
}