import InventoryItemsUtils from '../../../../utils/InventoryItemsUtils'
import MessageUtils from '../../../../utils/MessageUtils'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'
import InventoryItemService from '../../../db/services/items/InventoryItemService'
import LegacyInlineKeyboardManager from '../../../main/LegacyInlineKeyboardManager'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default class InventoryCommand extends BuckwheatCommand {
    protected _settingId: string = 'inventory'

    constructor () {
        super()
        this._name = 'инвентарь'
        this._aliases = [
            'вещи',
            'предметы'
        ]
        this._description = 'показываю все доступные тебе предметы\nвыбрав предмет, можно купить или продать его на рынке'
    }

    async execute({ ctx, id }: BuckwheatCommandOptions): Promise<void> {
        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/inventory/start.pug',
            {
                inlineKeyboard: await LegacyInlineKeyboardManager.get(
                    'inventory/start',
                    {
                        id
                    }
                )
            }
        )
    }
}