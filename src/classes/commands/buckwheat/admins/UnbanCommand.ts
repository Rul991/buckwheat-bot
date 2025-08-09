import { Context } from 'telegraf'
import AdminCommand from './AdminCommand'
import AdminUtils from '../../../../utils/AdminUtils'

export default class UnbanCommand extends AdminCommand {
    constructor() {
        super()
        this._name = 'разбан'
        this._folder = 'ban'
    }

    protected async _do(ctx: Context, replyId: number, _: number): Promise<boolean> {
        try {
            await AdminUtils.unban(ctx, replyId)
            return true
        }
        catch(e) {
            return false
        }
    }
}