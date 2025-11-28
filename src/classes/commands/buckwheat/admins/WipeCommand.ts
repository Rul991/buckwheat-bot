import ContextUtils from '../../../../utils/ContextUtils'
import MessageUtils from '../../../../utils/MessageUtils'
import RankUtils from '../../../../utils/RankUtils'
import { TextContext, MaybeString } from '../../../../utils/values/types/types'
import UserRankService from '../../../db/services/user/UserRankService'
import InlineKeyboardManager from '../../../main/InlineKeyboardManager'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default class WipeCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'вайп'
        this._isShow = false
    }

    async execute(ctx: TextContext, _: MaybeString): Promise<void> {
        if(ctx.chat.type == 'private') {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/wipe/private.pug'
            )
            return
        }
        
        const chatId = ctx.chat.id
        const id = ctx.from.id
        const rank = await UserRankService.get(chatId, id)

        if(!RankUtils.canUse({
            adminRank: RankUtils.max,
            userRank: rank
        })) {
            const changeValues = await ContextUtils.getUserFromContext(ctx)
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/wipe/not-admin.pug',
                {changeValues}
            )
            return
        }

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/wipe/choose.pug',
            {
                inlineKeyboard: await InlineKeyboardManager.get(
                    'wipe/wipe', 
                    {
                        chatId: JSON.stringify({chatId}),
                        userId: JSON.stringify({userId: id})
                    }
                )
            }
        )
    }
}