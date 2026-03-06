import AdminUtils from '../../../../utils/AdminUtils'
import RankUtils from '../../../../utils/RankUtils'
import { TextContext } from '../../../../utils/values/types/contexts'
import AdminCommand from './AdminCommand'

export default class extends AdminCommand {
    protected _settingId: string = 'kick'

    constructor () {
        super()

        this._name = 'кик'
        this._description = 'выгоняю игрока из чата'
        this._replySupport = true

        this._folder = 'kick'
        this._isUndoCommand = false
        this._minimumRank = RankUtils.admin
    }

    protected async _do(ctx: TextContext, replyId: number, _time: number, _chatId: number): Promise<boolean> {
        return await AdminUtils.kick(
            ctx,
            replyId
        )
    }
}