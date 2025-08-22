import InventoryItem from '../../../interfaces/schemas/InventoryItem'
import InventoryItemsUtils from '../../../utils/InventoryItemsUtils'
import MessageUtils from '../../../utils/MessageUtils'
import { TextContext, MaybeString } from '../../../utils/values/types'
import InventoryItemService from '../../db/services/items/InventoryItemService'
import BuckwheatCommand from '../base/BuckwheatCommand'

export default class InventoryCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'инвентарь'
        this._description = 'показываю все доступные тебе предметы'
    }

    async execute(ctx: TextContext, _: MaybeString): Promise<void> {
        const items = (await InventoryItemService.getAll(ctx.from.id) ?? [])
            .map(v => {
                const {name, type} = InventoryItemsUtils.getItemDescription(v.itemId)
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