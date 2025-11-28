import { Context } from 'telegraf'
import AdminCommand from './AdminCommand'
import AdminUtils from '../../../../utils/AdminUtils'
import { TextContext } from '../../../../utils/values/types/types'
import RankUtils from '../../../../utils/RankUtils'

export default class MuteCommand extends AdminCommand {
    constructor() {
        super()

        this._name = 'мут'
        this._description = 'заклеиваю рот игрока на определенное время'
        this._needData = true
        this._replySupport = true
        this._argumentText = 'время'

        this._folder = 'mute'
        this._isUndoCommand = false
        this._minimumRank = RankUtils.moderator
    }

    protected async _do(ctx: TextContext, replyId: number, time: number): Promise<boolean> {
        return await AdminUtils.mute(ctx, replyId, time)
    }
}