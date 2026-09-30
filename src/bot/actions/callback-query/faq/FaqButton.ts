import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { type FaqButtonData, FaqButtonDataSchema } from "../../../../protos/faq_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import MessageUtils from "../../../../utils/bot/MessageUtils"
import { backFaqKeyboard } from "../../../keyboards/faq"
import FaqUtils from "../../../../utils/faq/FaqUtils"

class FaqButton extends CallbackQueryAction<FaqButtonData> {
    override schema: GenMessage<FaqButtonData> = FaqButtonDataSchema
    override defaultTextKey: string = 'faq/button/show'
    override minimumRank: number = RankUtils.min
    override settingId: number = 115
    override name: string = 'faq'
    
    protected override async _execute(options: CallbackQueryActionOptions<FaqButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            data,
            ctx
        } = options

        const {
            index,
            page
        } = data
        
        const faq = FaqUtils.getVars(ctx, index)
        if(!faq) return {
            key: 'faq/message/not-exist'
        }

        await MessageUtils.editText(
            ctx,
            'faq/message/show',
            {
                vars: {
                    faq
                },
                keyboard: await backFaqKeyboard(
                    ctx,
                    {
                        page
                    }
                )
            }
        )
    }
}

export default new FaqButton()