import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { type ExchangeCardButtonData, ExchangeCardButtonDataSchema } from "../../../../protos/card_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import UserCardService from "../../../../db/services/card/UserCardService"
import CardUtils from "../../../../utils/card/CardUtils"
import MessageUtils from "../../../../utils/bot/MessageUtils"
import { lootboxMaterialItem } from "../../../../resources/items/inventory"

class ExchangeCardButton extends CallbackQueryAction<ExchangeCardButtonData> {
    override schema: GenMessage<ExchangeCardButtonData> = ExchangeCardButtonDataSchema
    override defaultTextKey: string = 'card/button/exchange'
    override minimumRank: number = RankUtils.min
    override settingId: number = 165
    override name: string = 'excard'
    
    protected override async _getId(options: CallbackQueryActionOptions<ExchangeCardButtonData>): Promise<number | number[] | undefined> {
        return Number(options.data.id)
    }
    
    protected override async _execute(options: CallbackQueryActionOptions<ExchangeCardButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            data,
            chatId,
            id,
            ctx
        } = options

        const {
            cardId
        } = data

        const exchangeResult = await UserCardService.exchange({
            chatId,
            id,
            card: cardId
        })

        if(!exchangeResult.ok) {
            return {
                key: `card/message/reason/${exchangeResult.reason}`
            }
        }

        const userCard = (await UserCardService.get({
            chatId,
            id,
            card: cardId
        }))!

        const {
            card,
            count: {
                materials,
                cards
            }
        } = exchangeResult

        const {
            key,
            vars,
            keyboard
        } = CardUtils.showCollection({
            card,
            userCard,
            ctx
        })

        await MessageUtils.editText(
            ctx,
            key,
            {
                vars,
                keyboard
            }
        )

        return {
            key: 'card/message/exchanged',
            vars: {
                card,
                materials,
                cards,
                item: lootboxMaterialItem.getVars(ctx)
            },
            isAlert: true
        }
    }
}

export default new ExchangeCardButton()
