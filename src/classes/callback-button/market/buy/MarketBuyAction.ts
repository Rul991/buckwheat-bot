import { number, object, string, ZodType } from 'zod'
import { CallbackButtonOptions } from '../../../../utils/values/types/action-options'
import CallbackButtonAction from '../../CallbackButtonAction'
import { idSchema } from '../../../../utils/values/schemas'
import ContextUtils from '../../../../utils/ContextUtils'
import MarketSlotService from '../../../db/services/market/MarketSlotService'
import FileUtils from '../../../../utils/FileUtils'
import MessageUtils from '../../../../utils/MessageUtils'
import InlineKeyboardManager from '../../../main/InlineKeyboardManager'

type Data = {
    count: number,
    id: number,
    itemId?: string,
    slot: number
    page: number
}

export default class extends CallbackButtonAction<Data> {
    protected _schema: ZodType<Data> | null = idSchema
        .and(object({
            count: number(),
            slot: number(),
            page: number(),
            itemId: string().optional()
        }))

    constructor () {
        super()
        this._name = 'marketbuy'
        this._buttonTitle = 'Рынок: Купить'
    }

    async execute(options: CallbackButtonOptions<Data>): Promise<string | void> {
        const {
            ctx,
            data
        } = options

        const {
            count,
            id,
            itemId,
            slot,
            page
        } = data

        if (await ContextUtils.showAlertIfIdNotEqual(ctx, id)) return

        const {
            done,
            reason
        } = await MarketSlotService.buy({
            slot,
            buyer: id,
            count
        })

        if (done) {
            await MessageUtils.editText(
                ctx,
                await FileUtils.readPugFromResource(
                    `text/commands/market/alert/${reason}.pug`
                ),
                {
                    reply_markup: {
                        inline_keyboard: await InlineKeyboardManager.get(
                            'market/after-buy',
                            {
                                id,
                                page,
                                slot,
                                itemId: JSON.stringify({ itemId })
                            }
                        )
                    }
                }
            )
        }

        return await FileUtils.readPugFromResource(
            `text/commands/market/alert/${reason}.pug`
        )
    }
}