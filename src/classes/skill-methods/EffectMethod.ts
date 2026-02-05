import { JavascriptTypes } from '../../utils/values/types/types'
import SkillMethod from './SkillMethod'

export default class<T extends any[] = [string, number]> extends SkillMethod<T> {
    args: JavascriptTypes[] = ['string', 'number']
}