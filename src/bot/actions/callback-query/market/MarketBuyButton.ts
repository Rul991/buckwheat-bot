import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { type MarketBuyButtonData, MarketBuyButtonDataSchema } from "../../../../protos/market_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import MarketSlotService from "../../../../db/services/market/MarketSlotService"
import MarketSlotUtils from "../../../../utils/market/MartketSlotUtils"
import MessageUtils from "../../../../utils/bot/MessageUtils"
import type { BotContext } from "../../../../types/bot"

type BuyResult = Awaited<ReturnType<typeof MarketSlotService['buy']>>

class MarketBuyButton extends CallbackQueryAction<MarketBuyButtonData> {
    override schema: GenMessage<MarketBuyButtonData> = MarketBuyButtonDataSchema
    override defaultTextKey: string = 'market/button/buy'
    override minimumRank: number = RankUtils.min
    override settingId: number = 145
    override name: string = 'mbuy'

    private _showBuyResult(ctx: BotContext, buyResult: BuyResult) {
        const ok = buyResult.ok
        const reason = ctx.t(`market/reason/${buyResult.reason}`)

        return {
            key: 'market/message/buy-result',
            vars: {
                ok,
                reason
            }
        }
    }

    protected override async _getId(options: CallbackQueryActionOptions<MarketBuyButtonData>): Promise<number | number[] | undefined> {
        return Number(options.data.id)
    }

    protected override async _execute(options: CallbackQueryActionOptions<MarketBuyButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            data,
            chatId,
            ctx,
            id
        } = options

        const {
            slotId,
            count,
            page
        } = data

        const buyResult = await MarketSlotService.buy({
            chatId,
            buyer: id,
            count,
            slotId
        })

        if (!buyResult.ok) {
            return this._showBuyResult(ctx, buyResult)
        }

        const slot = await MarketSlotService.get(slotId)
        if (slot) {
            const {
                key,
                options: messageOptions
            } = await MarketSlotUtils.show({
                count,
                ctx,
                page,
                slot
            })

            await MessageUtils.editText(
                ctx,
                key,
                messageOptions
            )
        }
        else {
            const {
                key,
                options: messageOptions
            } = await MarketSlotUtils.bought({
                ctx,
                id,
                page
            })
            await MessageUtils.editText(
                ctx,
                key,
                messageOptions
            )
        }

        return this._showBuyResult(ctx, buyResult)
    }
}

export default new MarketBuyButton()
