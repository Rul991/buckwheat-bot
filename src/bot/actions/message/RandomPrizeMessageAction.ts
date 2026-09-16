import { RANDOM_PRIZE_CHANCE } from "../../../consts/chances"
import BalanceService from "../../../db/services/money/BalanceService"
import SettingValueService from "../../../db/services/settings/SettingValueService"
import { spawnBoxSetting } from "../../../resources/settings/chat"
import type { MessageActionOptions } from "../../../types/action-options"
import type { ChatTypes } from "../../../types/types"
import MessageUtils from "../../../utils/bot/MessageUtils"
import RandomUtils from "../../../utils/math/RandomUtils"
import { boxKeyboard } from "../../keyboards/keyboard"
import MessageAction from "../base/MessageAction"

export default class RandomPrizeMessageAction extends MessageAction {
    override chatTypes: ChatTypes[] = ['chat']
    override async execute(options: MessageActionOptions): Promise<boolean | void> {
        const {
            chatId,
            ctx
        } = options
        if(!chatId) return

        const isNeedBox = RandomUtils.chance(RANDOM_PRIZE_CHANCE)
        if(!isNeedBox) return

        const canSpawnBoxSettingValue = await SettingValueService.get({
            id: chatId,
            setting: spawnBoxSetting
        })

        const canSpawnBox = canSpawnBoxSettingValue.value
        if(!canSpawnBox) return

        const botId = ctx.me.id
        const balance = await BalanceService.getUserBalance(
            chatId,
            botId
        )
        const money = balance?.total ?? 0
        if(money <= 0) return

        await MessageUtils.reply(
            ctx,
            'box/spawn',
            {
                keyboard: await boxKeyboard(ctx, {})
            }
        )
    }
}