import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { type ShopCardBuyButtonData, ShopCardBuyButtonDataSchema } from "../../../../protos/card_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import ShopCardService from "../../../../db/services/card/ShopCardService"
import CardUtils from "../../../../utils/card/CardUtils"
import MessageUtils from "../../../../utils/bot/MessageUtils"
import CardService from "../../../../db/services/card/CardService"

class ShopCardBuyButton extends CallbackQueryAction<ShopCardBuyButtonData> {
    override schema: GenMessage<ShopCardBuyButtonData> = ShopCardBuyButtonDataSchema
    override defaultTextKey: string = 'card/button/buy'
    override minimumRank: number = RankUtils.min
    override settingId: number = 167
    override name: string = 'shcardbuy'

    protected override async _getId(options: CallbackQueryActionOptions<ShopCardBuyButtonData>): Promise<number | number[] | undefined> {
        return Number(options.data.id)
    }

    protected override async _execute(options: CallbackQueryActionOptions<ShopCardBuyButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            data,
            chatId,
            id: buyer,
            ctx
        } = options

        const {
            slotId,
            count
        } = data

        const buyResult = await ShopCardService.buy({
            chatId,
            buyer,
            slotId,
            count
        })

        if (!buyResult.ok) {
            return {
                key: `card/message/reason/${buyResult.reason}`
            }
        }

        const {
            count: boughtCount
        } = buyResult

        const shopCard = await ShopCardService.get(slotId)
        if (!shopCard) {
            await MessageUtils.deleteMessages(ctx)
            return {
                key: 'card/message/bought'
            }
        }

        const card = await CardService.get(shopCard.card)
        if (!card) {
            await MessageUtils.deleteMessages(ctx)
            return {
                key: 'card/message/bought'
            }
        }

        const {
            key,
            vars,
            media
        } = await CardUtils.showShop({
            shopCard,
            card,
            ctx,
            chatId,
            currentCount: count
        })

        await MessageUtils.editMedia(
            ctx,
            media.fileId,
            {
                key,
                vars,
                keyboard: ctx.msg?.reply_markup
            }
        )

        return {
            key: 'card/message/bought',
            vars: {
                card,
                count: boughtCount
            }
        }
    }
}

export default new ShopCardBuyButton()
