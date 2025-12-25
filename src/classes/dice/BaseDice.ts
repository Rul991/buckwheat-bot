import { Context } from 'telegraf'
import { DiceValues } from '../../utils/values/types/types'
import { DiceContext } from '../../utils/values/types/contexts'
import BaseAction from '../actions/base/BaseAction'
import { DiceOptions } from '../../utils/values/types/action-options'

export default abstract class BaseDice extends BaseAction {
    protected _name: DiceValues

    constructor() {
        super()
        this._name = '🎲'
    }

    abstract execute(options: DiceOptions): Promise<void>
}