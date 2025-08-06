import BaseAction from '../actions/base/BaseAction'
import { CallbackButtonContext } from '../../utils/types'

export default abstract class CallbackButtonAction extends BaseAction {
    abstract execute(ctx: CallbackButtonContext, data: string): Promise<void>
}