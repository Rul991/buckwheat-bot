import { Context } from 'telegraf'
import { MaybeString } from '../../../utils/types'
import BaseAction from '../../actions/base/BaseAction'

export default abstract class BuckwheatCommand extends BaseAction {
    abstract execute(ctx: Context, other: MaybeString): Promise<void>
}