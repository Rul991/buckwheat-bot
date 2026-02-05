import { JavascriptTypes } from '../../utils/values/types/types'
import EffectMethod from './EffectMethod'

export default class extends EffectMethod<[string, number, number]> {
    args: JavascriptTypes[] = ['string', 'number', 'number']
}