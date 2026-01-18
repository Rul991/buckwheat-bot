import { number, object, ZodType } from 'zod'
import { CallbackButtonOptions } from '../../../utils/values/types/action-options'
import CallbackButtonAction from '../CallbackButtonAction'
import ContextUtils from '../../../utils/ContextUtils'
import { idSchema } from '../../../utils/values/schemas'
import MessageUtils from '../../../utils/MessageUtils'
import FileUtils from '../../../utils/FileUtils'
import GeneratorsService from '../../db/services/generators/GeneratorsService'
import { GENERATOR_INCOME_PER_HOUR, GENERATOR_UPGRADE_PRICE_PER_LEVEL } from '../../../utils/values/consts'
import InlineKeyboardManager from '../../main/InlineKeyboardManager'
import GeneratorUtils from '../../../utils/GeneratorUtils'

type Data = {
    id: number
    i: number
    p: number
}

export default class extends CallbackButtonAction<Data> {
    protected _schema: ZodType<Data> | null = idSchema
        .and(object({
            i: number(),
            p: number(),
        }))

    constructor () {
        super()
        this._name = 'gs'
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
            p: page
        } = data

        if (await ContextUtils.showAlertIfIdNotEqual(ctx, id)) return

        const generator = await GeneratorsService.get(chatId, id)
        const {
            generators
        } = generator

        const moneyGenerator = generators[index]
        if (!moneyGenerator) return await FileUtils.readPugFromResource(
            'text/commands/generator/add/no-devices.pug'
        )

        const {
            level,
            id: generatorId
        } = moneyGenerator

        const incomePerHour = level * GENERATOR_INCOME_PER_HOUR
        const upgradeLevels = GeneratorUtils.getUpgradeLevels(level)

        await MessageUtils.editText(
            ctx,
            await FileUtils.readPugFromResource(
                'text/commands/generator/show.pug',
                {
                    changeValues: {
                        level,
                        incomePerHour,
                        id: generatorId,
                        user: await ContextUtils.getUser(chatId, id),
                    }
                }
            ),
            {
                reply_markup: {
                    inline_keyboard: await InlineKeyboardManager.map(
                        'generator/show',
                        {
                            globals: {
                                page,
                                id,
                                index
                            },
                            values: {
                                upgrade: upgradeLevels.map(
                                    ({
                                        level,
                                        price
                                    }) => {
                                        return {
                                            text: `${level}ур. (${price} 💰)`,
                                            data: level.toString()
                                        }
                                    }
                                )
                            },
                        }
                    )
                }
            }
        )
    }
}