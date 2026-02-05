import { number, object, string, ZodType } from 'zod'
import { CallbackButtonOptions } from '../../../../utils/values/types/action-options'
import CallbackButtonAction from '../../CallbackButtonAction'
import { idSchema } from '../../../../utils/values/schemas'
import ContextUtils from '../../../../utils/ContextUtils'
import InventoryItemService from '../../../db/services/items/InventoryItemService'
import FileUtils from '../../../../utils/FileUtils'
import ArrayUtils from '../../../../utils/ArrayUtils'
import { FIRST_INDEX, MAX_COUNT_BUTTONS_LENGTH } from '../../../../utils/values/consts'
import MessageUtils from '../../../../utils/MessageUtils'
import LegacyInlineKeyboardManager from '../../../main/LegacyInlineKeyboardManager'
import StringUtils from '../../../../utils/StringUtils'

type Data = {
    id: number
    itemId: string
    count?: number
}

export default class extends CallbackButtonAction<Data> {
    protected _schema: ZodType<Data> | null = idSchema
        .and(object({
            itemId: string(),
            count: number().optional()
        }))

    constructor () {
        super()
        this._name = 'marketsellcount'
        this._buttonTitle = 'Рынок: Выбор количества при продаже'
    }

    async execute(options: CallbackButtonOptions<Data>): Promise<string | void> {
        const {
            ctx,
            chatId,
            data
        } = options

        const {
            id,
            count: needCount = 1,
            itemId
        } = data
        if (await ContextUtils.showAlertIfIdNotEqual(ctx, id)) return

        const item = await InventoryItemService.showItem(
            chatId,
            id,
            itemId
        )

        const {
            count
        } = item

        if (count < needCount) {
            return await FileUtils.readPugFromResource(
                'text/commands/market/sell/no-item.pug'
            )
        }

        const counts = ArrayUtils.generateMultipliedSequence({
            avoidNumber: needCount,
            maxLength: MAX_COUNT_BUTTONS_LENGTH,
            maxValue: count
        })

        await MessageUtils.editText(
            ctx,
            await FileUtils.readPugFromResource(
                'text/commands/market/sell/show.pug',
                {
                    changeValues: {
                        item,
                        needCount
                    }
                }
            ),
            {
                reply_markup: {
                    inline_keyboard: await LegacyInlineKeyboardManager.map(
                        'market/sell/show',
                        {
                            values: {
                                count: counts.map(
                                    count => {
                                        return {
                                            text: StringUtils.toFormattedNumber(count),
                                            data: JSON.stringify({
                                                ...data,
                                                count
                                            })
                                        }
                                    }
                                ),
                                countTitle: [{ text: '', data: '' }].slice(FIRST_INDEX, counts.length - 1)
                            },
                            globals: {
                                id,
                                count: needCount,
                                itemId: JSON.stringify({
                                    itemId
                                })
                            }
                        }
                    )
                }
            }
        )
    }
}