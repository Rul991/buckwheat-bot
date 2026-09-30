import InventoryItem from "../../../../../db/entities/items/InventoryItem"
import DuelistService from "../../../../../db/services/duel/DuelistService"
import SelectedGunService from "../../../../../db/services/gun/SelectedGunService"
import InventoryItemService from "../../../../../db/services/items/InventoryItemService"
import UserService from "../../../../../db/services/user/UserService"
import { kickPvpSetting } from "../../../../../resources/settings/chat"
import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import AdminUtils from "../../../../../utils/bot/AdminUtils"
import RankUtils from "../../../../../utils/db/RankUtils"
import ItemUtils from "../../../../../utils/items/ItemUtils"
import { gunsKeyboard } from "../../../../keyboards/inventory"
import BuckwheatCommand from "../../../base/BuckwheatCommand"

export default class ShotCommand extends BuckwheatCommand {
    override aliases: string[] = ['выстрел', 'выстрелить', 'оружие', 'орудие']
    override filename: string = 'shot'
    override minimumRank: number = RankUtils.min
    override settingId: number = 90
    override name: string = 'расстрелять'
    override isSupportReply: boolean = true

    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            ctx,
            chatId,
            id,
            replyFrom
        } = options

        const gun = await SelectedGunService.get(
            chatId,
            id
        )
        const gunId = gun.selectedGun
        const item = gunId !== undefined ? ItemUtils.get(gunId) : undefined

        if (!replyFrom || gunId === undefined || !item) {
            const inventory = await InventoryItemService.getInventory(chatId, id)
            const guns = InventoryItem.getGuns(inventory)
            const shouldChoose = guns.length > 0

            return {
                key: 'gun/show',
                options: {
                    vars: {
                        item: item?.getVars(ctx),
                        shouldChoose
                    },
                    keyboard: shouldChoose ? await gunsKeyboard(
                        ctx,
                        {
                            guns,
                            id
                        }
                    ) : undefined
                }
            }
        }

        const replyId = replyFrom.id != ctx.me.id ? replyFrom.id : id
        const isSelf = replyId == id

        const user = await ctx.vars.user.get()
        const reply = isSelf ? user : await UserService.get(chatId, replyFrom.id)

        const hasGun = await InventoryItemService.hasByUser({
            chatId,
            id,
            item
        })

        if (!hasGun) {
            return {
                key: 'gun/no-gun',
                options: {
                    vars: {
                        user,
                        reply,
                        item: {
                            ...item,
                        },
                        itemVars: item.getVars(ctx),
                    }
                }
            }
        }

        const gunResult = await DuelistService.gun({
            chatId,
            owner: id,
            target: replyId,
            item,
            ctx
        })

        if (!gunResult.ok) {
            return {
                key: `gun/${gunResult.reason}`,
                options: {
                    vars: {
                        user,
                        item: {
                            ...item,
                            ...item.getVars(ctx)
                        }
                    }
                }
            }
        }

        const {
            damage,
            shieldDestroyed,
            isDead
        } = gunResult

        const isKicked = isDead && await AdminUtils.gameKick({
            ctx,
            chatId,
            id: replyId,
            setting: kickPvpSetting
        })

        return {
            key: 'gun/shot',
            options: {
                vars: {
                    user,
                    item: item.getVars(ctx),
                    reply,
                    damage,
                    shieldDestroyed,
                    isKicked
                }
            }
        }
    }
}