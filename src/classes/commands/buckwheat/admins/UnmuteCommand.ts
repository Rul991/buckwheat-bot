import { Context } from 'telegraf'
import AdminCommand from './AdminCommand'
import AdminUtils from '../../../../utils/AdminUtils'
import { TextContext } from '../../../../utils/values/types'
import RankUtils from '../../../../utils/RankUtils'

export default class UnmuteCommand extends AdminCommand {
    constructor() {
        super()

        this._name = 'размут'
        this._description = 'разрешаю говорить игроку'
        this._replySupport = true

        this._folder = 'mute'
        this._minimumRank = RankUtils.moderator
    }

    protected async _do(ctx: TextContext, replyId: number, _: number): Promise<boolean> {
        return await AdminUtils.unmute(ctx, replyId)
    }
}