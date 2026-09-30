import SettingValueService from "../../db/services/settings/SettingValueService"
import { grindSetting } from "../../resources/settings/user"
import type { BotContext } from "../../types/bot"

export default class GrindUtils {
    static async isSendMessage(ctx: BotContext, id: number): Promise<boolean> {
        if (ctx.chat?.type != 'private') return true

        const grindSettingValue = await SettingValueService.get({
            id,
            setting: grindSetting
        })
        
        const isGrind = grindSettingValue.value
        return !isGrind
    }
}