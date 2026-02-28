import { ChatJoinRequestOptions } from '../../../utils/values/types/action-options'
import BaseAction from '../base/BaseAction'

export default abstract class extends BaseAction {
    abstract execute(options: ChatJoinRequestOptions): Promise<void>
}