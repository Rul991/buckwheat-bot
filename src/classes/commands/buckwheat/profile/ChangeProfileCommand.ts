import ContextUtils from '../../../../utils/ContextUtils'
import MessageUtils from '../../../../utils/MessageUtils'
import RankUtils from '../../../../utils/RankUtils'
import { TextContext, MaybeString, HasOtherChangeProfileMessage, NoOtherChangeProfileMessage } from '../../../../utils/values/types/types'
import LinkedChatService from '../../../db/services/linkedChat/LinkedChatService'
import UserNameService from '../../../db/services/user/UserNameService'
import UserRankService from '../../../db/services/user/UserRankService'
import BuckwheatCommand from '../../base/BuckwheatCommand'



export default abstract class extends BuckwheatCommand {
    protected abstract _folderName: string
    protected abstract _maxLength: number

    constructor () {
        super()
        this._needData = true
        this._replySupport = true
    }

    protected async _sendMessageIfNoOther({ ctx, chatId, id }: NoOtherChangeProfileMessage) {
        await MessageUtils.answerMessageFromResource(
            ctx,
            `text/commands/${this._folderName}/default.pug`,
            {
                changeValues: {
                    user: await ContextUtils.getUser(chatId, id)
                }
            }
        )
    }

    protected async _sendMessageIfBig({ other: name, ctx }: HasOtherChangeProfileMessage) {
        if (name.length > this._maxLength) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                `text/commands/${this._folderName}/big.pug`,
                {
                    changeValues: {
                        max: this._maxLength.toString()
                    }
                }
            )
            return true
        }

        return false
    }

    protected async _sendMessageUpdateProfile(options: HasOtherChangeProfileMessage) {
        const {
            ctx
        } = options

        await MessageUtils.answerMessageFromResource(
            ctx,
            `text/commands/${this._folderName}/changed.pug`,
            {
                changeValues: await this._getUpdateMessageChangeValues(options)
            }
        )
    }

    protected async _getUpdateMessageChangeValues({ 
        chatId, 
        id 
    }: HasOtherChangeProfileMessage): Promise<Record<string, any> | undefined> {
        return {
            user: await ContextUtils.getUser(chatId, id)
        }
    }

    protected async _sendMessageIfHasntRank({ ctx, id, chatId }: NoOtherChangeProfileMessage) {
        const {id: userId} = ctx.from
        if (userId == id) return false

        const rank = await UserRankService.get(chatId, userId)
        const hasNeedRank = rank >= RankUtils.admin

        if(!hasNeedRank) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                `text/commands/${this._folderName}/low-rank.pug`
            )
            return true
        }

        return false
    }

    protected abstract _updateProfile({
        other,
        chatId,
        id,
    }: HasOtherChangeProfileMessage): Promise<void>

    protected async _canSendMessageIfHasOther(options: HasOtherChangeProfileMessage) {
        if (await this._sendMessageIfBig(options)) return false

        return true
    }

    protected async _sendMessageIfHasOther(options: HasOtherChangeProfileMessage) {
        if (!await this._canSendMessageIfHasOther(options)) return
        
        await this._updateProfile(options)
        await this._sendMessageUpdateProfile(options)
    }

    async execute(ctx: TextContext, other: MaybeString): Promise<void> {
        const replyId = ContextUtils.getUserOrBotId(ctx)
        const chatId = await LinkedChatService.getCurrent(ctx, replyId)
        if (!chatId) return
        
        const options = {
            ctx,
            chatId,
            id: replyId
        }
        
        if (await this._sendMessageIfHasntRank(options)) return
        if (!other) {
            await this._sendMessageIfNoOther(options)
        }
        else {
            const newOptions = {
                ...options,
                other
            }
            await this._sendMessageIfHasOther(newOptions)
        }
    }
}