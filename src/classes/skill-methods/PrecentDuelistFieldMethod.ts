import { HpMana, JavascriptTypes } from '../../utils/values/types/types'
import SkillMethod from './SkillMethod'

export default class extends SkillMethod<[number]> {
    args: JavascriptTypes[] = ['number']

    constructor(symbol: string, characteristic: HpMana) {
        super()
    }
}