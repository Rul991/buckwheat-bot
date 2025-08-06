import { Context } from 'telegraf'
import BaseAction from '../base/BaseAction'

export default abstract class EveryMessageAction extends BaseAction {
    abstract execute(ctx: Context): Promise<void | true>
}