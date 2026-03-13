import AdminUtils from '../../../../utils/AdminUtils'
import ContextUtils from '../../../../utils/ContextUtils'
import GunsUtils from '../../../../utils/GunsUtils'
import InventoryItemsUtils from '../../../../utils/InventoryItemsUtils'
import MessageUtils from '../../../../utils/MessageUtils'
import RandomUtils from '../../../../utils/RandomUtils'
import ShieldUtils from '../../../../utils/ShieldUtils'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'
import { TextContext } from '../../../../utils/values/types/contexts'
import { GunWithId, InventoryItemDescription, ShieldWithId } from '../../../../utils/values/types/items'
import DuelistService from '../../../db/services/duelist/DuelistService'
import SelectedGunService from '../../../db/services/gun/SelectedGunService'
import InventoryItemService from '../../../db/services/items/InventoryItemService'
import InlineKeyboardManager from '../../../main/InlineKeyboardManager'
import BuckwheatCommand from '../../base/BuckwheatCommand'

type DefendResult = ShieldWithId | undefined

type ShotOptions = {
    gun: GunWithId
    item: InventoryItemDescription
    chatId: number,
    id: number,
    replyId: number
    ctx: TextContext
    defendResult: DefendResult
}

export default class extends BuckwheatCommand {
    protected _settingId: string = 'gun-command'

    constructor () {
        super()
        this._name = 'расстрелять'
        this._aliases = [
            'пистолет',
            'выстрел'
        ]

        this._description = 'позволяю вам выстрелить в игрока из оружия в вашем инвентаре\nесли написать команду, не отвечая на сообщение цели, можно выбрать стандартное оружие\nможешь даже не пытаться стрелять в меня'
        this._replySupport = true
    }

    private async _defendReplyByShield(chatId: number, replyId: number): Promise<DefendResult> {
        const items = await InventoryItemService.getAll(chatId, replyId)
        const shield = ShieldUtils.getCoolestShield(items)
        if (!shield) return undefined

        const {
            triggeringChance,
            id: itemId
        } = shield

        await InventoryItemService.use({
            chatId,
            id: replyId,
            itemId
        })

        const isDefend = RandomUtils.chance(triggeringChance)
        if(isDefend) {
            return shield
        }

        return undefined
    }

    private async _showList({
        ctx,
        chatId,
        id
    }: BuckwheatCommandOptions) {
        const items = await InventoryItemService.getAll(chatId, id)
        const guns = items
            .map(({ itemId }) => {
                const itemDescription = InventoryItemsUtils.getItemDescription(itemId)
                return itemDescription.gun ?
                    {
                        ...itemDescription,
                        itemId
                    } :
                    null
            })
            .filter(v => v !== null)

        const selectedGun = await SelectedGunService.get(
            chatId,
            id
        )

        const {
            gunId: selectedGunId
        } = selectedGun

        const selectedGunItemDescription = selectedGunId &&
            InventoryItemsUtils.getItemDescription(selectedGunId)

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/gun/list.pug',
            {
                inlineKeyboard: await InlineKeyboardManager.get(
                    'gun/list',
                    {
                        values: {
                            guns: guns
                                .map(({ name, itemId }) => {
                                    return {
                                        text: name,
                                        data: {
                                            item: itemId
                                        }
                                    }
                                })
                        },

                        globals: {
                            id
                        }
                    }
                ),

                changeValues: {
                    selectedGun: selectedGunItemDescription
                }
            }
        )
    }

    private async _shot({
        gun,
        item,
        chatId,
        ctx,
        replyId,
        id,
        defendResult: defendResult
    }: ShotOptions) {
        const damage = GunsUtils.getDamage(gun.id)
        const gunTitle = item.name
        let isKicked = false

        if (!defendResult) {
            const remainingHp = await DuelistService.addField(
                chatId,
                replyId,
                'hp',
                -damage
            )

            isKicked = remainingHp <= 0 ?
                await AdminUtils.gameKick({
                    ctx,
                    chatId,
                    id: replyId,
                    settingId: 'pvp'
                }) :
                false
        }

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
                    damage,
                    shield: defendResult ?
                        InventoryItemsUtils.getItemDescription(defendResult.id) :
                        undefined
                }
            }
        )
    }

    private async _getGunAndItem(chatId: number, id: number) {
        const gun = await SelectedGunService.getSelected(chatId, id)

        const gunId = gun.id
        const ammoId = GunsUtils.getAmmoItemId(gunId)
        if (!ammoId.length) return null

        const [isUsed] = await InventoryItemService.use({
            chatId,
            id,
            itemId: ammoId
        })
        if (!isUsed) return null

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
            ctx,
            replyFrom
        } = options

        const replyId = replyOrUserFrom.id != ctx.botInfo.id ?
            replyOrUserFrom.id :
            id

        if (id == replyId && !replyFrom) {
            return await this._showList(options)
        }

        const gunAndItem = await this._getGunAndItem(chatId, id)
        if (!gunAndItem) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/gun/no-gun.pug'
            )
            return
        }

        const defendResult = await this._defendReplyByShield(
            chatId,
            replyId
        )

        await this._shot({
            ...gunAndItem,
            ...options,
            replyId,
            defendResult
        })
    }
}