import { LeftMemberOptions } from '../../../utils/values/types/action-options'
import BaseAction from '../base/BaseAction'

export default abstract class LeftMemberAction extends BaseAction {
    abstract execute(options: LeftMemberOptions): Promise<void>
}