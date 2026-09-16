import { SEPARATOR } from "../../../../../consts/texts"
import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import RankUtils from "../../../../../utils/db/RankUtils"
import BuckwheatCommand from "../../../base/BuckwheatCommand"

export default class ChooseCommand extends BuckwheatCommand {
    override aliases: string[] = ['выбор']
    override minimumRank: number = RankUtils.min
    override settingId: number = 25
    override name: string = 'выбери'
    override filename: string = 'choose'
    override needData: boolean = true

    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            ctx,
            other
        } = options

        const text = other || ctx.msg.text
        const phrases = text
            .split(SEPARATOR)
            .map(v => v.trim())
            .filter(v => v.length > 0)

        return {
            key: 'random/choose',
            options: {
                vars: {
                    text,
                    phrases,
                }
            }
        }
    }
}