import SettingValueService from "../../../../../db/services/settings/SettingValueService"
import { pingEmojiSetting } from "../../../../../resources/settings/user"
import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import type { Reactions } from "../../../../../types/types"
import ContextUtils from "../../../../../utils/bot/ContextUtils"
import RankUtils from "../../../../../utils/db/RankUtils"
import BuckwheatCommand from "../../../base/BuckwheatCommand"

export default class PingCommand extends BuckwheatCommand {
    override aliases: string[] = ['приём', 'прием', 'работает']
    override minimumRank: number = RankUtils.min
    override settingId: number = 41
    override name: string = 'пинг'
    override filename: string = 'ping'
    
    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            id,
            ctx
        } = options

        const pingEmojiSettingValue = await SettingValueService.get({
            setting: pingEmojiSetting,
            id
        })
        const pingEmoji = pingEmojiSettingValue.value as Reactions

        await ContextUtils.react(
            ctx,
            pingEmoji
        )
    }
}