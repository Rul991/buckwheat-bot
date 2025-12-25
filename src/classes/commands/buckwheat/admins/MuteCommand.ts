import AdminCommand from './AdminCommand'
import AdminUtils from '../../../../utils/AdminUtils'
import { TextContext } from '../../../../utils/values/types/contexts'
import RankUtils from '../../../../utils/RankUtils'
import UserRankService from '../../../db/services/user/UserRankService'
import { NOT_FOUND_INDEX } from '../../../../utils/values/consts'
import ChatSettingsService from '../../../db/services/settings/ChatSettingsService'

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

    protected async _do(ctx: TextContext, replyId: number, time: number, chatId: number): Promise<boolean> {
        const muted = await AdminUtils.mute(ctx, replyId, time)

        if(muted && await ChatSettingsService.get<'boolean'>(chatId, 'canGetNegativeRank')) {
            await UserRankService.update(chatId, replyId, NOT_FOUND_INDEX)
        }

        return muted
    }
}