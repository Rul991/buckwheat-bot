import { MAX_PRECENTS } from "../../../consts/number"
import SettingValueService from "../../../db/services/settings/SettingValueService"
import { stickerChanceSetting } from "../../../resources/settings/chat"
import type { MessageActionOptions } from "../../../types/action-options"
import MessageUtils from "../../../utils/bot/MessageUtils"
import RandomUtils from "../../../utils/math/RandomUtils"
import MessageAction from "../base/MessageAction"

export default class RandomStickerMessageAction extends MessageAction {
    override async execute(options: MessageActionOptions): Promise<boolean | void> {
        const {
            chatId,
            ctx
        } = options
        if(!chatId) return

        const chat = await ctx.vars.chat.get()
        const stickerPackName = chat?.stickerPack
        if(!stickerPackName) return

        const chanceSettingValue = await SettingValueService.get({
            id: chatId,
            setting: stickerChanceSetting
        })

        const chance = chanceSettingValue.value / MAX_PRECENTS
        const isReply = RandomUtils.chance(chance)
        if(!isReply) return

        await MessageUtils.replyRandomSticker(
            ctx,
            stickerPackName
        )
    }
}