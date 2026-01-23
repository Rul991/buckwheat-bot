import InventoryItemsUtils from '../../../../utils/InventoryItemsUtils'
import MessageUtils from '../../../../utils/MessageUtils'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'
import InventoryItemService from '../../../db/services/items/InventoryItemService'
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
        this._description = 'показываю все доступные тебе предметы'
    }

    async execute({ ctx, chatId, id }: BuckwheatCommandOptions): Promise<void> {
        const items = (await InventoryItemService.getAll(chatId, id) ?? [])
            .map(v => {
                const { name, type } = InventoryItemsUtils.getItemDescription(v.itemId)
                return {
                    name,
                    count: InventoryItemsUtils.getCountString(v.count ?? 0, type)
                }
            })

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/inventory.pug',
            {
                changeValues: {
                    items
                }
            }
        )
    }
}