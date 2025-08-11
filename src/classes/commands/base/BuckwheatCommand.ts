import { MaybeString, TextContext } from '../../../utils/types'
import BaseAction from '../../actions/base/BaseAction'

export default abstract class BuckwheatCommand extends BaseAction {
    abstract execute(ctx: TextContext, other: MaybeString): Promise<void>
}