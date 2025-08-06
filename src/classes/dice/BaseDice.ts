import { Context } from 'telegraf'
import { DiceValues } from '../../utils/types'
import BaseAction from '../actions/base/BaseAction'

export default abstract class BaseDice extends BaseAction {
    protected _name: DiceValues

    constructor() {
        super()
        this._name = '🎲'
    }

    abstract execute(ctx: Context, value: number): Promise<void>
}