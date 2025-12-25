import BaseAction from '../base/BaseAction'
import { NewMemberOptions } from '../../../utils/values/types/action-options'

export default abstract class NewMemberAction extends BaseAction {
    constructor () {
        super()
    }

    abstract execute(options: NewMemberOptions): Promise<void>
}