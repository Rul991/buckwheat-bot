import FileUtils from '../../../utils/FileUtils'
import RandomUtils from '../../../utils/RandomUtils'
import { MethodExecuteOptions, MethodGetTextOptions } from '../../../utils/values/types/skills'
import { JavascriptTypes } from '../../../utils/values/types/types'
import DamageMethod from './DamageMethod'

export default class extends DamageMethod {
    args: JavascriptTypes[] = ['number', 'number']

    protected async _getRawDamage({ args: [min, max] }: MethodExecuteOptions<[number, number]>): Promise<number> {
        return RandomUtils.range(min, max)
    }

    protected async _getText(options: MethodGetTextOptions<[number, number]>): Promise<string> {
        const {
            args: [min, max]
        } = options

        return await FileUtils.readPugFromResource(
            'text/methods/random-damage.pug',
            {
                changeValues: {
                    min,
                    max
                }
            }
        )
    }
}