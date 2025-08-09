import { Context } from 'telegraf'
import AdminCommand from './AdminCommand'
import AdminUtils from '../../../../utils/AdminUtils'

export default class MuteCommand extends AdminCommand {
    constructor() {
        super()
        this._name = 'бан'
        this._folder = 'ban'
        this._isUndoCommand = false
    }

    protected async _do(ctx: Context, replyId: number, time: number): Promise<boolean> {
        try {
            await AdminUtils.ban(ctx, replyId, time)
            return true
        }
        catch(e) {
            return false
        }
    }
}