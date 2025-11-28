import MessageUtils from '../../../../utils/MessageUtils'
import { MAX_SHOP_COUNT } from '../../../../utils/values/consts'
import { TextContext, MaybeString } from '../../../../utils/values/types/types'
import InventoryItemService from '../../../db/services/items/InventoryItemService'
import LinkedChatService from '../../../db/services/linkedChat/LinkedChatService'
import InlineKeyboardManager from '../../../main/InlineKeyboardManager'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default class ShopCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'магазин'
        this._description = 'открываю магазин\nЕсли дописать в конце число, то я продам вам именно столько товара за раз'
        this._needData = true
        this._argumentText = 'количество товаров'
    }

    private _getCount(other: MaybeString): number {
        if(other && !isNaN(+other) && +other > 0)
            return Math.min(MAX_SHOP_COUNT, +other)
        else 
            return 1
    }

    async execute(ctx: TextContext, other: MaybeString): Promise<void> {
        const itemId = 'shopPrecent'
        const id = ctx.from.id
        const chatId = await LinkedChatService.getCurrent(ctx, id)
        if(!chatId) return

        const count = this._getCount(other)
        const owners = await InventoryItemService.getOwners(chatId, itemId)
        const totalCount = owners.reduce(
            (prev, curr) => prev + curr.count,
            0
        )
        const fullOwner = owners.length == 1 && totalCount == 100

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/shop/start.pug',
            {
                changeValues: {
                    totalCount,
                    fullOwner
                },
                inlineKeyboard: await InlineKeyboardManager.get(
                    'start_shop', 
                    `${ctx.from.id}_${count}`
                )
            }
        )
    }
}