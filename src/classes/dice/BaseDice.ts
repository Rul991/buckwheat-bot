import { Context } from 'telegraf'
import { DiceContext, DiceValues } from '../../utils/values/types'
import BaseAction from '../actions/base/BaseAction'

export default abstract class BaseDice extends BaseAction {
    protected _name: DiceValues

    constructor() {
        super()
        this._name = '🎲'
    }

    abstract execute(ctx: DiceContext, value: number): Promise<void>
}