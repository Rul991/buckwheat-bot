import MessageUtils from '../../../../utils/MessageUtils'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'
import InventoryItemService from '../../../db/services/items/InventoryItemService'
import InlineKeyboardManager from '../../../main/InlineKeyboardManager'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default class ShopCommand extends BuckwheatCommand {
    protected _settingId: string = 'shop'

    constructor() {
        super()
        this._name = 'магазин'
        this._aliases = [
            'магаз',
            'купить'
        ]
        this._description = 'открываю магазин\nЕсли дописать в конце число, то я продам вам именно столько товара за раз'
    }

    async execute({ ctx, id, chatId }: BuckwheatCommandOptions): Promise<void> {
        const itemId = 'shopPrecent'
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
                    JSON.stringify({
                        id
                    })
                )
            }
        )
    }
}