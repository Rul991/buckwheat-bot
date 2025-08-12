import { Context } from 'telegraf'
import BaseAction from '../base/BaseAction'
import { NewMemberContext } from '../../../utils/types'

export default abstract class NewMemberAction extends BaseAction {
    constructor() {
        super()
    }

    abstract execute(ctx: NewMemberContext): Promise<void>
}