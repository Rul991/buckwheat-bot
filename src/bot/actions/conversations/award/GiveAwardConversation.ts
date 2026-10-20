import { Conversation } from "@grammyjs/conversations"
import type { Context } from "grammy"
import type { BotContext } from "../../../../types/bot"
import ConversationAction from "../../base/ConversationAction"
import ConversationUtils from "../../../../utils/conversation/ConversationUtils"
import { chooseRankAwardKeyboard } from "../../../keyboards/award"
import { ONLY_NUMBER_REGEX } from "../../../../consts/regex"
import { MAX_AWARD_RANK, MAX_AWARD_TEXT_LENGTH, MIN_AWARD_RANK } from "../../../../consts/award"
import AwardService from "../../../../db/services/award/AwardService"
import Award from "../../../../db/entities/award/Award"
import UserService from "../../../../db/services/user/UserService"
import MessageUtils from "../../../../utils/bot/MessageUtils"
import MathUtils from "../../../../utils/math/MathUtils"

type T = [
    {
        giverId: number
        ownerId: number
    }
]

class GiveAwardConversation extends ConversationAction<T> {
    override name: string = 'give-award'

    protected override async _execute(conversation: Conversation<BotContext, Context>, _ctx: Context, ...[options]: T): Promise<void> {
        const {
            giverId,
            ownerId
        } = options

        await ConversationUtils.replyInConversation(
            conversation,
            'award/convo/rank',
            async ctx => {
                return {
                    lazyKeys: ['user'],
                    keyboard: await chooseRankAwardKeyboard(ctx, {})
                }
            }
        )

        const callbackCtx = await conversation.waitForCallbackQuery(ONLY_NUMBER_REGEX)
            .andFrom(giverId)
        await callbackCtx.deleteMessage()

        const rank = MathUtils.clamp(
            +callbackCtx.callbackQuery.data,
            MIN_AWARD_RANK,
            MAX_AWARD_RANK
        )
        const text = await ConversationUtils.getFormattedText({
            conversation,
            needId: giverId,
            lazyKeys: ['user'],
            max: MAX_AWARD_TEXT_LENGTH,
            key: 'award/convo/text',
            vars: {
                rank
            }
        })

        await conversation.external(
            async ctx => {
                const chatId = ctx.vars.chatId!
                const award = await AwardService.create(
                    new Award({
                        chatId,
                        id: ownerId,
                        giverId,
                        text,
                        rank
                    })
                )

                const giver = await ctx.vars.user.get()
                const owner = await UserService.get(chatId, ownerId)

                await MessageUtils.reply(
                    ctx,
                    'award/message/given',
                    {
                        vars: {
                            giver,
                            owner,
                            award,
                        }
                    }
                )
            }
        )
    }
}

export default new GiveAwardConversation()