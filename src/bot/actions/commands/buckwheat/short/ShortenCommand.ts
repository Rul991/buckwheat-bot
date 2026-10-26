import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import RankUtils from "../../../../../utils/db/RankUtils"
import { startShortCommandKeyboard } from "../../../../keyboards/short-command"
import BuckwheatCommand from "../../../base/BuckwheatCommand"

export default class ShortenCommand extends BuckwheatCommand {
    override aliases: string[] = ['уменьшить', 'сократить', 'сократи', 'сокращения', 'алиас']
    override filename: string = 'shorten'
    override minimumRank: number = RankUtils.min
    override settingId: number = 73
    override name: string = 'сокращение'
    protected override _rankCanBeChange: boolean = false

    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            id,
            ctx
        } = options

        return {
            key: 'shorten/list',
            options: {
                keyboard: await startShortCommandKeyboard(
                    ctx,
                    {
                        id
                    }
                )
            }
        }
    }
}