import { SEPARATOR } from "../../../../../consts/texts"
import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import RankUtils from "../../../../../utils/db/RankUtils"
import BuckwheatCommand from "../../../base/BuckwheatCommand"

export default class ProbabilityCommand extends BuckwheatCommand {
    override aliases: string[] = ['вероятности', 'шансы', 'опрос']
    override filename: string = 'probability'
    override minimumRank: number = RankUtils.min
    override settingId: number = 124
    override name: string = 'вероятность'

    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            other
        } = options

        if (!other) {
            return {
                key: 'probability/no-other'
            }
        }

        const values = other
            .split(SEPARATOR)
            .filter(v => v.length > 0)
        let total = 0

        const chances = values
            .map(v => {
                const value = Math.log(Math.random())
                total += value

                return {
                    text: v.trim(),
                    value
                }
            })
            .map(v => {
                return {
                    text: v.text,
                    chance: v.value / total * 100
                }
            })
            .sort((a, b) => b.chance - a.chance)

        return {
            key: 'probability/probability',
            options: {
                vars: {
                    chances
                }
            }
        }
    }
}