import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import RankUtils from "../../../../../utils/db/RankUtils"
import Logger from "../../../../../utils/logs/Logger"
import RandomUtils from "../../../../../utils/math/RandomUtils"
import StringUtils from "../../../../../utils/string/StringUtils"
import BuckwheatCommand from "../../../base/BuckwheatCommand"

export default class RandomCommand extends BuckwheatCommand {
    override aliases: string[] = ['ранд']
    override minimumRank: number = RankUtils.min
    override settingId: number = 19
    override name: string = 'рандом'
    override filename: string = 'random'
    override needData: boolean = true
    
    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            other = ''
        } = options

        const [rawFirst, rawSecond, rawStep] = StringUtils.splitBySpace(other, 3).map(v => v.trim())
        const first = StringUtils.getNumberFromString(rawFirst || '0')
        const second = StringUtils.getNumberFromString(rawSecond || '1000')
        const step = Math.ceil(StringUtils.getNumberFromString(rawStep || '0'))

        const min = Math.min(first, second)
        const max = Math.max(first, second)
        const result = RandomUtils.range(min, max, step)

        Logger.debug(
            'RandomCommand',
            {
                rawFirst,
                rawSecond,
                first,
                second,
                min,
                max,
                step,
                result
            }
        )

        return {
            key: 'random/random',
            options: {
                vars: {
                    min,
                    max,
                    result,
                    step
                }
            }
        }
    }
}