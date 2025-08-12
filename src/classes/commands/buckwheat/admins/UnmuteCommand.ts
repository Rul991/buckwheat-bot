import { Context } from 'telegraf'
import AdminCommand from './AdminCommand'
import AdminUtils from '../../../../utils/AdminUtils'
import { TextContext } from '../../../../utils/types'
import RankUtils from '../../../../utils/RankUtils'

export default class UnmuteCommand extends AdminCommand {
    constructor() {
        super()

        this._name = 'размут'
        this._description = 'разрешаю говорить игроку'
        this._replySupport = true

        this._folder = 'mute'
        this._minimumRank = RankUtils.moderatorRank
    }

    protected async _do(ctx: TextContext, replyId: number, _: number): Promise<boolean> {
        try {
            await AdminUtils.unmute(ctx, replyId)
            return true
        }
        catch(e) {
            return false
        }
    }
}