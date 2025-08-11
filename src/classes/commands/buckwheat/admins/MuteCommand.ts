import { Context } from 'telegraf'
import AdminCommand from './AdminCommand'
import AdminUtils from '../../../../utils/AdminUtils'
import { TextContext } from '../../../../utils/types'

export default class MuteCommand extends AdminCommand {
    constructor() {
        super()
        this._name = 'мут'
        this._folder = 'mute'
        this._isUndoCommand = false
        this._minimumRank = 3
    }

    protected async _do(ctx: TextContext, replyId: number, time: number): Promise<boolean> {
        try {
            await AdminUtils.mute(ctx, replyId, time)
            return true
        }
        catch(e) {
            return false
        }
    }
}