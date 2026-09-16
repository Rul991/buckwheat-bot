import InventoryItemService from "../../../../../db/services/items/InventoryItemService"
import UserService from "../../../../../db/services/user/UserService"
import { cookieItem } from "../../../../../resources/items/inventory"
import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import RankUtils from "../../../../../utils/db/RankUtils"
import BuckwheatCommand from "../../../base/BuckwheatCommand"

export default class CookieCommand extends BuckwheatCommand {
    override aliases: string[] = ['печенья', 'печенье', 'печеньки']
    override filename: string = 'cookie'
    override minimumRank: number = RankUtils.min
    override settingId: number = 76
    override name: string = 'печенька'
    override isSupportReply: boolean = true

    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            chatId,
            id,
            replyFrom,
            ctx
        } = options

        const item = cookieItem
        const inventoryItem = await InventoryItemService.get({
            chatId,
            id,
            item
        })

        if (!inventoryItem?.count) {
            return {
                key: 'cookie/no-cookie'
            }
        }

        if (!replyFrom) {
            await InventoryItemService.use({
                chatId,
                id,
                item,
                count: 1,
                ctx
            })
            return
        }

        const replyId = replyFrom.id
        const isSelf = replyFrom.id == id
        let isShare = true

        if (!isSelf) {
            const { ok } = await InventoryItemService.gift({
                chatId,
                owner: id,
                target: replyId,
                count: 1,
                item
            })
            isShare = ok
        }

        return {
            key: 'cookie/share',
            options: {
                vars: {
                    user: ctx.vars.user,
                    reply: isSelf ? ctx.vars.user : await UserService.get(chatId, replyId),
                    isShare
                }
            }
        }
    }
}