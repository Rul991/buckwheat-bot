import SettingValueService from "../../../db/services/settings/SettingValueService"
import { diceAnswerChanceSetting } from "../../../resources/settings/chat"
import type { DiceActionOptions } from "../../../types/action-options"
import type { Dices } from "../../../types/types"
import MessageUtils from "../../../utils/bot/MessageUtils"
import RandomUtils from "../../../utils/math/RandomUtils"
import DiceAction from "../base/DiceAction"

export default class CubeDiceAction extends DiceAction {
    override settingId: number = 32
    override filename: string = 'cubedice'
    override name: Dices = '🎲'

    override async execute(options: DiceActionOptions): Promise<void> {
        const {
            ctx,
            chatId
        } = options
        
        const chanceSettingValue = await SettingValueService.get({
            id: chatId,
            setting: diceAnswerChanceSetting
        })
        
        const chance = chanceSettingValue.value
        if(!RandomUtils.chance(chance)) return

        await MessageUtils.replyDice(
            ctx,
            '🎲'
        )
    }
}