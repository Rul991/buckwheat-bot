import { LeftMemberContext } from '../../../utils/values/types'
import BaseAction from '../base/BaseAction'

export default abstract class LeftMemberAction extends BaseAction {
    abstract execute(ctx: LeftMemberContext): Promise<void>
}