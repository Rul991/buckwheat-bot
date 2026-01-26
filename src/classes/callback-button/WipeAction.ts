import { number, object, ZodType } from 'zod'
import CallbackButtonAction from './CallbackButtonAction'
import MessageUtils from '../../utils/MessageUtils'
import InventoryItemService from '../db/services/items/InventoryItemService'
import ContextUtils from '../../utils/ContextUtils'
import { CallbackButtonOptions } from '../../utils/values/types/action-options'
import TotalService from '../db/services/total/TotalService'
import RankUtils from '../../utils/RankUtils'

type Data = {
    chatId: number,
    userId: number
}

export default class extends CallbackButtonAction<Data> {
    protected _minimumRank: number = RankUtils.max
    protected _buttonTitle: string = 'Вайп'
    protected _schema: ZodType<Data> = object({
        chatId: number(),
        userId: number(),
    })

    constructor () {
        super()
        this._name = 'wipe'
    }

    private async _wipe(chatId: number): Promise<boolean> {
        await TotalService.wipe(chatId)

        const userItemId = 'greedBox'
        return await InventoryItemService.anyHas(chatId, userItemId)
    }

    private async _giveNewGameIfGreedBox(chatId: number, has: boolean) {
        const chatItemId = 'newGame'

        if (has) {
            await InventoryItemService.add({
                chatId,
                id: chatId,
                itemId: chatItemId
            })
        }
    }

    async execute({ ctx, data: { chatId, userId } }: CallbackButtonOptions<Data>): Promise<string | void> {
        if (await ContextUtils.showAlertIfIdNotEqual(ctx, userId)) return

        await this._giveNewGameIfGreedBox(
            chatId,
            await this._wipe(chatId)
        )

        const changeValues = {
            chatTitle: 'title' in ctx.chat! ? ctx.chat?.title : ''
        }

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/wipe/wipe.pug',
            { changeValues }
        )
        await MessageUtils.deleteMessage(ctx)
    }
}