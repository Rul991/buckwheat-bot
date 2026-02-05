import { JavascriptTypes } from '../../utils/values/types/types'
import EffectMethod from './EffectMethod'

export default class extends EffectMethod<[string, string, number]> {
    args: JavascriptTypes[] = ['string', 'string', 'number']

    constructor(has: boolean) {
        super()
    }
}