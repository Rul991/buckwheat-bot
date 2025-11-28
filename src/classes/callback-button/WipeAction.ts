import { JSONSchemaType } from 'ajv'
import { CallbackButtonContext } from '../../utils/values/types/types'
import CallbackButtonAction from './CallbackButtonAction'
import MessageUtils from '../../utils/MessageUtils'
import CasinoWipeService from '../db/services/casino/CasinoWipeService'
import InventoryItemService from '../db/services/items/InventoryItemService'
import ItemsService from '../db/services/items/ItemsService'
import LevelService from '../db/services/level/LevelService'
import WorkService from '../db/services/work/WorkService'
import ContextUtils from '../../utils/ContextUtils'

type Data = {
    chatId: number,
    userId: number
}

export default class extends CallbackButtonAction<Data> {
    protected _schema: JSONSchemaType<Data> = {
        type: 'object',
        properties: {
            chatId: { type: 'number'},
            userId: { type: 'number'}
        },
        required: ['chatId', 'userId']
    }
    
    constructor() {
        super()
        this._name = 'wipe'
    }
    
    private async _wipe(chatId: number): Promise<boolean> {
        await LevelService.wipe(chatId)
        await ItemsService.wipe(chatId)
        await WorkService.wipe(chatId)
        await CasinoWipeService.money(chatId)

        const userItemId = 'greedBox'
        return await InventoryItemService.anyHas(chatId, userItemId)
    }

    private async _giveNewGameIfGreedBox(chatId: number, has: boolean) {
        const chatItemId = 'newGame'

        if(has) {
            await InventoryItemService.add(chatId, chatId, chatItemId)
        }
    }

    async execute(ctx: CallbackButtonContext, {chatId, userId}: Data): Promise<string | void> {
        if(await ContextUtils.showAlertIfIdNotEqual(ctx, userId)) return 
        
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
            {changeValues}
        )
        await MessageUtils.deleteMessage(ctx)
    }
}