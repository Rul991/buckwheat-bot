import FileUtils from '../../utils/FileUtils'
import RandomUtils from '../../utils/RandomUtils'
import { JavascriptTypes, MethodExecuteArguments, SkillMethodGetText } from '../../utils/values/types'
import DamageMethod from './DamageMethod'

export default class extends DamageMethod {
    args: JavascriptTypes[] = ['number', 'number']

    protected async _getRawDamage({ args: [min, max], }: MethodExecuteArguments<[number, number]>): Promise<number> {
        return RandomUtils.range(min, max)
    }

    async getText(options: MethodExecuteArguments<[number, number]> & SkillMethodGetText): Promise<string> {
        const {
            skill: { onEnemy },
            args: [rawMin, rawMax],
            attack
        } = options

        const boost = this._getBoost(attack)
        const getValue = (value: number) => Math.floor(value * boost)

        const min = getValue(rawMin)
        const max= getValue(rawMax)

        return await FileUtils.readPugFromResource(
            'text/methods/random-damage.pug',
            {
                changeValues: {
                    min,
                    max,
                    onEnemy,
                }
            }
        )
    }
}