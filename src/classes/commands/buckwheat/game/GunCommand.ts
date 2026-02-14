import AdminUtils from '../../../../utils/AdminUtils'
import ContextUtils from '../../../../utils/ContextUtils'
import GunsUtils from '../../../../utils/GunsUtils'
import InventoryItemsUtils from '../../../../utils/InventoryItemsUtils'
import MessageUtils from '../../../../utils/MessageUtils'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'
import DuelistService from '../../../db/services/duelist/DuelistService'
import InventoryItemService from '../../../db/services/items/InventoryItemService'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default class extends BuckwheatCommand {
    protected _settingId: string = 'gun-command'

    constructor () {
        super()
        this._name = 'расстрелять'
        this._aliases = [
            'пистолет',
            'выстрел'
        ]

        this._description = 'позволяю вам выстрелить в игрока из оружия в вашем инвентаре'
        this._replySupport = true
        this._isPremium = true
    }

    private async _getGunAndItem(chatId: number, id: number) {
        const items = await InventoryItemService.getAll(chatId, id)
        const gun = GunsUtils.getGun(items)

        const gunId = gun.id
        if (!gunId.length) return null

        await InventoryItemService.use({
            chatId,
            id,
            itemId: gunId
        })
        return {
            gun,
            item: InventoryItemsUtils.getItemDescription(gunId)
        }
    }

    async execute(options: BuckwheatCommandOptions): Promise<void> {
        const {
            chatId,
            replyOrUserFrom,
            id,
            ctx
        } = options

        const replyId = replyOrUserFrom.id
        const gunAndItem = await this._getGunAndItem(chatId, id)

        if (!gunAndItem) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/gun/no-gun.pug'
            )
            return
        }
        const {
            gun,
            item
        } = gunAndItem
        const damage = GunsUtils.getDamage(gun.id)
        const gunTitle = item.name

        const remainingHp = await DuelistService.addField(
            chatId,
            replyId,
            'hp',
            -damage
        )
        const isKicked = remainingHp <= 0 ?
            await AdminUtils.gameKick({
                ctx,
                chatId,
                id: replyId
            }) :
            false

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/gun/shot.pug',
            {
                changeValues: {
                    id,
                    replyId,
                    gunTitle,
                    user: await ContextUtils.getUser(chatId, id),
                    reply: await ContextUtils.getUser(chatId, replyId),
                    isKicked,
                    damage
                }
            }
        )
    }
}