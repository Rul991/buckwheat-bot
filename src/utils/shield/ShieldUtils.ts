import DuelistService from "../../db/services/duel/DuelistService"
import type { ItemCallbackOptions } from "../../types/items"
import MessageUtils from "../bot/MessageUtils"

export default class ShieldUtils {
    static async use(options: ItemCallbackOptions): Promise<void> {
        const {
            ctx,
            chatId,
            id,
            count,
            item
        } = options

        const durability = count * (item.shield?.durability ?? 0)
        const user = await ctx.vars.user.get()
        
        await Promise.allSettled([
            MessageUtils.reply(
                ctx,
                'shield/add',
                {
                    vars: {
                        durability,
                        user,
                        item: {
                            title: item.getTitle(ctx)
                        },
                        count
                    }
                }
            ),
            DuelistService.addShield({
                chatId,
                id,
                item,
                count
            })
        ])
    }
}