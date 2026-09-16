import { WRONG_COMMAND_REACTS } from "../../../../../consts/texts"
import SettingValueService from "../../../../../db/services/settings/SettingValueService"
import { wrongCommandReactSetting } from "../../../../../resources/settings/chat"
import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import ContextUtils from "../../../../../utils/bot/ContextUtils"
import RankUtils from "../../../../../utils/db/RankUtils"
import RandomUtils from "../../../../../utils/math/RandomUtils"
import BuckwheatCommand from "../../../base/BuckwheatCommand"

export default class NotExistCommand extends BuckwheatCommand {
    override aliases: string[] = []
    override minimumRank: number = RankUtils.min
    override name: string = this.constructor.name
    override settingId: number = 9
    override filename: string = ''

    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            chatId,
            ctx,
        } = options

        const wrongCommandReactSettingValue = await SettingValueService.get({
            id: chatId,
            setting: wrongCommandReactSetting
        })
        const wrongCommandReact = wrongCommandReactSettingValue.value

        if (wrongCommandReact) {
            await ContextUtils.react(
                ctx,
                RandomUtils.choose(WRONG_COMMAND_REACTS)
            )
            return
        }
        
        return {
            key: 'commands/system/not-exist'
        }
    }
}