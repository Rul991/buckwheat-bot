import { Conversation } from "@grammyjs/conversations"
import type { Context } from "grammy"
import type UserCard from "../../../../db/entities/card/UserCard"
import type Card from "../../../../db/entities/card/Card"
import type { BotContext } from "../../../../types/bot"
import ConversationAction from "../../base/ConversationAction"
import ConversationUtils from "../../../../utils/conversation/ConversationUtils"
import { MAX_CARD_PRICE, MIN_CARD_PRICE } from "../../../../consts/cards"
import ShopCardService from "../../../../db/services/card/ShopCardService"
import ShopCard from "../../../../db/entities/card/ShopCard"

type T = [{
    userCard: UserCard
    card: Card
}]

class SellCardConversation extends ConversationAction<T> {
    override name: string = 'sell-card'

    protected override async _execute(conversation: Conversation<BotContext, Context>, ctx: Context, ...[values]: T): Promise<void> {
        const needId = ctx.from!.id
        const {
            card,
            userCard
        } = values

        const price = await ConversationUtils.getNumber({
            conversation,
            needId,
            min: MIN_CARD_PRICE,
            max: MAX_CARD_PRICE,
            lazyKeys: ['user'],
            vars: {
                card
            },
            key: 'card/conversation/sell/price'
        })

        const count = await ConversationUtils.getNumber({
            conversation,
            needId,
            min: 1,
            max: userCard.count,
            lazyKeys: ['user'],
            vars: {
                card
            },
            key: 'card/conversation/sell/count'
        })
        
        await conversation.external(
            async ctx => {
                const chatId = ctx.vars.chatId!
                return await ShopCardService.create(
                    new ShopCard({
                        chatId,
                        card: card.id,
                        count,
                        price,
                        seller: needId
                    })
                )
            }
        )

        await ConversationUtils.replyInConversation(
            conversation,
            'card/conversation/sell/done',
            {
                lazyKeys: ['user'],
                vars: {
                    card,
                    count,
                    price
                }
            }
        )
    }
}

export default new SellCardConversation()