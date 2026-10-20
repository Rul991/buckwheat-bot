import { Conversation } from "@grammyjs/conversations"
import type { Context } from "grammy"
import type { BotContext } from "../../../../types/bot"
import ConversationAction from "../../base/ConversationAction"
import ConversationUtils from "../../../../utils/conversation/ConversationUtils"
import { MAX_CARD_DESCRIPTION_LENGTH, MAX_CARD_NAME_LENGTH } from "../../../../consts/lengths"
import { ONLY_NUMBER_REGEX } from "../../../../consts/regex"
import MathUtils from "../../../../utils/math/MathUtils"
import { MAX_CARD_RARITY, MIN_CARD_RARITY } from "../../../../consts/cards"
import CardService from "../../../../db/services/card/CardService"
import Card from "../../../../db/entities/card/Card"
import { chooseCardRarityKeyboard } from "../../../keyboards/cards"
import type { Message } from "grammy/types"
import MessageUtils from "../../../../utils/bot/MessageUtils"

type T = []

class SuggestCardConversation extends ConversationAction<T> {
    override name: string = 'suggest-card'

    private async _deleteMessage(conversation: Conversation<BotContext, Context>, msg: Message | undefined) {
        if (!msg) return false
        return await conversation.external(
            async ctx => {
                return await MessageUtils.deleteMessages(
                    ctx,
                    msg.message_id
                )
            }
        )
    }

    private async _getImage(conversation: Conversation<BotContext, Context>, needId: number): Promise<string> {
        const msg = await ConversationUtils.replyInConversation(
            conversation,
            'card/conversation/suggest/image',
            {
                lazyKeys: ['user']
            }
        )

        const ctx = await conversation.waitFor(
            'msg:photo',
            {
                otherwise: async _ => {
                    await ConversationUtils.replyInConversation(
                        conversation,
                        'card/conversation/suggest/stop',
                        {
                            lazyKeys: ['user']
                        }
                    )
                    await conversation.halt()
                }
            }
        )
            .andFrom(needId)

        await this._deleteMessage(conversation, msg)
        return ctx.msg.photo.at(-1)?.file_id!
    }

    private async _getName(conversation: Conversation<BotContext, Context>, needId: number): Promise<string> {
        const msg = await ConversationUtils.replyInConversation(
            conversation,
            'card/conversation/suggest/name',
            {
                lazyKeys: ['user'],
                vars: {
                    max: MAX_CARD_NAME_LENGTH
                }
            }
        )

        const ctx = await conversation.waitFor('msg:text')
            .andFrom(needId)
        const text = ctx.msg.text
            .slice(0, MAX_CARD_NAME_LENGTH)
            .trim()

        await this._deleteMessage(conversation, msg)
        return text
    }

    private async _getDescription(conversation: Conversation<BotContext, Context>, needId: number): Promise<string> {
        return await ConversationUtils.getFormattedText({
            conversation,
            needId,
            max: MAX_CARD_DESCRIPTION_LENGTH,
            key: 'card/conversation/suggest/description',
            lazyKeys: ['user']
        })
    }

    private async _getRarity(conversation: Conversation<BotContext, Context>, needId: number): Promise<number> {
        const msg = await ConversationUtils.replyInConversation(
            conversation,
            'card/conversation/suggest/rarity',
            async ctx => ({
                lazyKeys: ['user'],
                keyboard: await chooseCardRarityKeyboard(ctx, {})
            })
        )

        const ctx = await conversation.waitForCallbackQuery(ONLY_NUMBER_REGEX)
            .andFrom(needId)
        const rarity = MathUtils.clamp(
            +ctx.callbackQuery.data,
            MIN_CARD_RARITY,
            MAX_CARD_RARITY
        )

        await this._deleteMessage(conversation, msg)
        return rarity
    }

    protected override async _execute(conversation: Conversation<BotContext, Context>, ctx: Context, ...[]: T): Promise<void> {
        const needId = ctx.from!.id
        const image = await this._getImage(conversation, needId)
        const name = await this._getName(conversation, needId)

        const description = await this._getDescription(conversation, needId)
        const rarity = await this._getRarity(conversation, needId)

        const card = await conversation.external(
            async _ => {
                return await CardService.create(
                    new Card({
                        name,
                        description,
                        image,
                        rarity,
                        isSuggested: true
                    })
                )
            }
        )

        await ConversationUtils.replyInConversation(
            conversation,
            'card/conversation/suggest/done',
            {
                lazyKeys: ['user'],
                vars: {
                    card
                }
            }
        )
    }
}

export default new SuggestCardConversation()