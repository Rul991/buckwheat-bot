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

    async execute({ ctx, data: { chatId, userId } }: CallbackButtonOptions<Data>): Promise<string | void> {
        if (await ContextUtils.showAlertIfIdNotEqual(ctx, userId)) return

        const newGameId = 'newGame'
        const endGameId = 'greedBox'

        const endGameOwners = await InventoryItemService.getOwners(
            chatId,
            endGameId
        )
        const newGameOwners = await InventoryItemService.getOwners(
            chatId,
            newGameId
        )

        await TotalService.wipe(chatId)
        for (const {
            id,
            count
        } of [...endGameOwners, ...newGameOwners]) {
            await InventoryItemService.add({
                chatId,
                id,
                count,
                itemId: newGameId
            })
        }

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