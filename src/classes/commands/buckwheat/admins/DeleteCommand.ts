import MessageUtils from '../../../../utils/MessageUtils'
import RankUtils from '../../../../utils/RankUtils'
import { TextContext } from '../../../../utils/values/types/contexts'
import AdminCommand from './AdminCommand'

export default class extends AdminCommand {
    protected _settingId: string = 'deleteMessage'

    constructor() {
        super()

        this._name = 'удалить'
        this._description = 'удаляю сообщение'
        this._argumentText = '<причина>'
        this._needData = true
        this._replySupport = true

        this._folder = 'delete'
        this._isUndoCommand = false
        this._minimumRank = RankUtils.moderator
    }

    protected async _do(ctx: TextContext, _reply: number, _time: number): Promise<boolean> {
        if (!ctx.message.reply_to_message) return false

        const {
            message_id: messageId
        } = ctx.message.reply_to_message

        return await MessageUtils.deleteMessage(ctx, messageId)
    }
}