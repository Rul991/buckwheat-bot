import { Context } from 'telegraf'
import AdminCommand from './AdminCommand'
import AdminUtils from '../../../../utils/AdminUtils'

export default class UnmuteCommand extends AdminCommand {
    constructor() {
        super()
        this._name = 'размут'
        this._folder = 'mute'
    }

    protected async _do(ctx: Context, replyId: number, _: number): Promise<boolean> {
        try {
            await AdminUtils.unmute(ctx, replyId)
            return true
        }
        catch(e) {
            return false
        }
    }
}