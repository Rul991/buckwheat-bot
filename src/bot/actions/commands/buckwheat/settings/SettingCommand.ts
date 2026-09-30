import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import RankUtils from "../../../../../utils/db/RankUtils"
import { settingStartKeyboard } from "../../../../keyboards/settings"
import BuckwheatCommand from "../../../base/BuckwheatCommand"

export default class SettingCommand extends BuckwheatCommand {
    override aliases: string[] = ['дк', 'дб', 'конфиг', 'настройка']
    protected override _rankCanBeChange: boolean = false
    override minimumRank: number = RankUtils.min
    override settingId: number = 38
    override name: string = 'настройки'
    override filename: string = 'setting'
    
    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            ctx
        } = options

        return {
            key: 'setting/start',
            options: {
                keyboard: await settingStartKeyboard(
                    ctx,
                    {}
                )
            }
        }
    }
}