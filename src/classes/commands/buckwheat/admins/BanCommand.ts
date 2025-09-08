import AdminCommand from './AdminCommand'
import AdminUtils from '../../../../utils/AdminUtils'
import { TextContext } from '../../../../utils/values/types'

export default class MuteCommand extends AdminCommand {
    constructor() {
        super()

        this._name = 'бан'
        this._description = 'выгоняю игрока на время или навсегда'
        this._needData = true
        this._replySupport = true
        this._argumentText = 'время'

        this._folder = 'ban'
        this._isUndoCommand = false
        this._aliases = ['кик']
    }

    protected async _do(ctx: TextContext, replyId: number, time: number): Promise<boolean> {
        return await AdminUtils.ban(ctx, replyId, time)
    }
}