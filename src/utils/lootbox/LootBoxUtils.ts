import InventoryItemService from "../../db/services/items/InventoryItemService"
import type { GetRandomItemResult, ItemCallbackOptions } from "../../types/items"
import MessageUtils from "../bot/MessageUtils"
import type Item from "../items/Item"
import ArrayUtils from "../math/ArrayUtils"
import RandomUtils from "../math/RandomUtils"

export default class LootBoxUtils {
    static getCount(item: Item): number {
        const [min, max] = item.drop.lootBoxCount
        return RandomUtils.range(min, max)
    }

    static async use(options: ItemCallbackOptions) {
        const {
            chatId,
            id,
            ctx,
            count
        } = options

        const user = await ctx.vars.user.get()
        const itemResults: GetRandomItemResult[] = []
        for (const _ of ArrayUtils.range(1, count)) {
            const result = await InventoryItemService.getRandomItem({
                chatId,
                id,
                type: 'lootbox'
            })

            if (result.item && result.count > 0) {
                const index = itemResults.findIndex(v => v.item?.id == result.item?.id)
                if(index !== -1) {
                    itemResults[index]!.count += count
                }
                else {
                    itemResults.push(result)
                }
                
                await InventoryItemService.add({
                    chatId,
                    id,
                    count: result.count,
                    item: result.item
                })
            }
        }

        await MessageUtils.reply(
            ctx,
            'lootbox/opened',
            {
                vars: {
                    user,
                    itemResults: itemResults
                        .map(
                            v => {
                                return {
                                    count: v.count,
                                    item: v.item?.getVars(ctx)
                                }
                            }
                        )
                }
            }
        )
    }
}