import { gunsKeyboard } from "../../bot/keyboards/inventory"
import type { BotContext } from "../../types/bot"
import type Item from "../items/Item"

type ShowOptions = {
    item: Item | undefined
    ctx: BotContext
    id: number
}

export default class GunUtils {
    static async show({
        item,
        ctx,
        id
    }: ShowOptions) {
        const shouldChoose = true
        return {
            key: 'gun/show',
            options: {
                vars: {
                    item: item?.getVars(ctx),
                    shouldChoose
                },
                keyboard: ctx.msg?.reply_markup ?? await gunsKeyboard(
                    ctx,
                    {
                        id
                    }
                )
            }
        }
    }
}