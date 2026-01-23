import { MyChatMemberOptions } from '../../../utils/values/types/action-options'
import BaseAction from '../base/BaseAction'

export default abstract class MyChatMemberAction extends BaseAction {
    abstract execute(options: MyChatMemberOptions): Promise<void>
}