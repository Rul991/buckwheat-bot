import { HpMana, JavascriptTypes } from '../../utils/values/types/types'
import DuelistFieldAddMethod from './DuelistFieldAddMethod'

export default class extends DuelistFieldAddMethod {
    args: JavascriptTypes[] = ['number', 'string']

    constructor(symbol: string, characteristic: HpMana) {
        super(symbol, characteristic)
    }
}