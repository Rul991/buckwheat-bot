import { literal, number, object, ZodType } from 'zod'
import CallbackButtonAction from '../../CallbackButtonAction'
import { idSchema } from '../../../../utils/values/schemas'
import { CallbackButtonOptions } from '../../../../utils/values/types/action-options'
import ContextUtils from '../../../../utils/ContextUtils'
import MarketSlotService from '../../../db/services/market/MarketSlotService'
import FileUtils from '../../../../utils/FileUtils'
import MessageUtils from '../../../../utils/MessageUtils'
import InventoryItemService from '../../../db/services/items/InventoryItemService'
import LegacyInlineKeyboardManager from '../../../main/LegacyInlineKeyboardManager'
import ArrayUtils from '../../../../utils/ArrayUtils'
import { FIRST_INDEX, MAX_COUNT_BUTTONS_LENGTH } from '../../../../utils/values/consts'
import StringUtils from '../../../../utils/StringUtils'
import CasinoGetService from '../../../db/services/casino/CasinoGetService'

type Data = {
    slot: number
    id: number
    page: number
    hasItemId?: 1
    count?: number
}

export default abstract class extends CallbackButtonAction<Data> {
    protected abstract _folder: string
    protected _schema: ZodType<Data> | null = idSchema
        .and(object({
            slot: number(),
            page: number(),
            hasItemId: literal(1).optional(),
            count: number().optional()
        }))

    async execute(options: CallbackButtonOptions<Data>): Promise<string | void> {
        const {
            ctx,
            data,
            chatId
        } = options

        const {
            slot: slotId,
            id,
            page,
            hasItemId,
            count: needCount = 1
        } = data

        if (await ContextUtils.showAlertIfIdNotEqual(ctx, id)) return

        const slot = await MarketSlotService.get(
            slotId
        )

        if(!slot) {
            return await FileUtils.readPugFromResource(
                'text/commands/market/no-slot.pug'
            )
        }

        const {
            itemId,
            userId: seller,
            count
        } = slot

        const item = await InventoryItemService.showItem(
            chatId,
            seller,
            itemId
        )

        const counts = ArrayUtils.generateMultipliedSequence({
            maxValue: count,
            maxLength: MAX_COUNT_BUTTONS_LENGTH,
            avoidNumber: needCount
        })

        const balance = await CasinoGetService.money(chatId, id)

        await MessageUtils.editText(
            ctx,
            await FileUtils.readPugFromResource(
                `text/commands/market/${this._folder}/show.pug`,
                {
                    changeValues: {
                        item,
                        slot,
                        seller: await ContextUtils.getUser(chatId, seller),
                        needCount,
                        balance
                    },
                }
            ),
            {
                reply_markup: {
                    inline_keyboard: await LegacyInlineKeyboardManager.map(
                        `market/${this._folder}/show`,
                        {
                            values: {
                                countTitle: [{text: '', data: ''}]
                                    .slice(FIRST_INDEX, counts.length - 1),
                                count: counts.map(count => {
                                    return {
                                        text: StringUtils.toFormattedNumber(count),
                                        data: JSON.stringify({
                                            ...data,
                                            count
                                        })
                                    }
                                })
                            },
                            globals: {
                                page,
                                id,
                                itemId: JSON.stringify({
                                    itemId: hasItemId ? itemId : undefined
                                }),
                                count: needCount,
                                slot: slotId
                            }
                        }
                    )
                }
            }
        )
    }
}