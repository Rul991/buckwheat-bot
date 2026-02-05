import { JavascriptTypes } from '../../utils/values/types/types'
import SkillMethod from './SkillMethod'

export default class extends SkillMethod<[number, number]> {
    args: JavascriptTypes[] = ['number']
}