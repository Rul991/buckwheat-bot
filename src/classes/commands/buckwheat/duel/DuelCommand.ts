import MessageUtils from '../../../../utils/MessageUtils'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'
import DuelistService from '../../../db/services/duelist/DuelistService'
import UserClassService from '../../../db/services/user/UserClassService'
import LegacyInlineKeyboardManager from '../../../main/LegacyInlineKeyboardManager'
import BuckwheatCommand from '../../base/BuckwheatCommand'
import DuelPrepareService from '../../../db/services/duel/DuelPrepareService'

export default class DuelCommand extends BuckwheatCommand {
    protected _settingId: string = 'duel'

    constructor() {
        super()
        this._name = 'дуэль'
        this._aliases = [
            'вызов',
            'сразиться'
        ]
        this._description = 'выступаю посредником в дуэле'
        this._replySupport = true
    }

    async execute({ ctx, chatId, replyFrom: replyUser }: BuckwheatCommandOptions): Promise<void> {
        if(ctx.chat.type == 'private') {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/duel/private.pug'
            )
            return
        }

        if(!replyUser) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/duel/no-reply.pug'
            )
            return
        }

        const userId = ctx.from.id
        const replyId = replyUser.id

        if(userId == replyId) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/duel/same-reply.pug'
            )
            return
        }

        if(!await UserClassService.isPlayer(chatId, userId)) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/duel/unknown.pug'
            )
            return
        }

        const user = await DuelPrepareService.getDuelistLinkWithPrice(chatId, userId)
        const reply = await DuelPrepareService.getDuelistLinkWithPrice(chatId, replyId)

        const message = await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/duel/yes-offer/offer.pug',
            {
                changeValues: {
                    user,
                    reply
                },
                inlineKeyboard: await LegacyInlineKeyboardManager.get(
                    'duels/offer',
                    JSON.stringify({
                        user: userId,
                        reply: replyId
                    })
                )
            }
        )

        const {
            message_id: messageId
        } = message
        await DuelistService.deleteAndUpdateLastMessage(ctx, messageId)
    }
}