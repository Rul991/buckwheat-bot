import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { type BusinessShowButtonData, BusinessShowButtonDataSchema } from "../../../../protos/business_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import BusinessStockService from "../../../../db/services/business/BusinessStockService"
import MessageUtils from "../../../../utils/bot/MessageUtils"
import BusinessService from "../../../../db/services/business/BusinessService"
import { MAX_BUSINESS_STAKES } from "../../../../consts/number"
import { businessShowKeyboard } from "../../../keyboards/business"

class BusinessShowButton extends CallbackQueryAction<BusinessShowButtonData> {
    override schema: GenMessage<BusinessShowButtonData> = BusinessShowButtonDataSchema
    override defaultTextKey: string = 'business/button/stock/show'
    override minimumRank: number = RankUtils.min
    override settingId: number = 175
    override name: string = 'bsh'
    
    protected override async _getId(options: CallbackQueryActionOptions<BusinessShowButtonData>): Promise<number | number[] | undefined> {
        return Number(options.data.id)
    }
    
    protected override async _execute(options: CallbackQueryActionOptions<BusinessShowButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            data,
            chatId,
            id,
            ctx,
        } = options

        const {
            page,
            businessId
        } = data

        const business = await BusinessService.get(businessId)
        if(!business) {
            return {
                key: 'business/message/not-exist'
            }
        }

        const stock = await BusinessStockService.get({
            chatId,
            id,
            businessId
        })
        if(!stock) {
            return {
                key: 'business/message/stock/not-exist'
            }
        }

        await MessageUtils.editText(
            ctx,
            'business/message/stock/show',
            {
                vars: {
                    business,
                    stock: {
                        ...stock,
                        max: MAX_BUSINESS_STAKES
                    }
                },
                keyboard: await businessShowKeyboard(
                    ctx,
                    {
                        id,
                        page,
                        businessId
                    }
                )
            }
        )
    }
}

export default new BusinessShowButton()
