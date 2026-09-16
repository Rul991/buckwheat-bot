import { MAX_PRECENTS } from "../../../consts/number"
import { REACT_EMOJIES } from "../../../consts/texts"
import SettingValueService from "../../../db/services/settings/SettingValueService"
import { reactChanceSetting } from "../../../resources/settings/chat"
import type { MessageActionOptions } from "../../../types/action-options"
import type { ChatTypes } from "../../../types/types"
import ContextUtils from "../../../utils/bot/ContextUtils"
import RandomUtils from "../../../utils/math/RandomUtils"
import MessageAction from "../base/MessageAction"

export default class ReactionMessageAction extends MessageAction {
    override chatTypes: ChatTypes[] = ['chat']

    private async _getReactionChance(chatId: number): Promise<number> {
        const settingValue = await SettingValueService.get({
            setting: reactChanceSetting,
            id: chatId
        })

        return settingValue.value / MAX_PRECENTS
    }

    override async execute(options: MessageActionOptions): Promise<boolean | void> {
        const {
            ctx,
            chatId
        } = options
        if (!chatId) return

        const chance = await this._getReactionChance(chatId)
        const isReact = RandomUtils.chance(chance)
        if (!isReact) return

        const reaction = RandomUtils.choose(REACT_EMOJIES)!
        await ContextUtils.react(
            ctx,
            reaction
        )
    }
}