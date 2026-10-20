import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { type SuggestedCardModerateButtonData, SuggestedCardModerateButtonDataSchema } from "../../../../protos/card_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import CardService from "../../../../db/services/card/CardService"

class SuggestedCardModerateButton extends CallbackQueryAction<SuggestedCardModerateButtonData> {
    override schema: GenMessage<SuggestedCardModerateButtonData> = SuggestedCardModerateButtonDataSchema
    override defaultTextKey: string = 'card/button/moderate'
    override minimumRank: number = RankUtils.min
    override settingId: number = 163
    override name: string = 'sugmod'
    
    protected override async _getId(options: CallbackQueryActionOptions<SuggestedCardModerateButtonData>): Promise<number | number[] | undefined> {
        return Number(options.data.id)
    }
    
    protected override async _execute(options: CallbackQueryActionOptions<SuggestedCardModerateButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            data
        } = options

        const {
            isApprove,
            cardId
        } = data

        const card = await CardService.get(cardId)
        if(!card) {
            return {
                key: 'card/message/not-exist'
            }
        }

        if(isApprove) {
            await CardService.approve(cardId)
        }
        else {
            await CardService.reject(cardId)
        }

        return {
            key: 'card/message/moderate-result',
            vars: {
                isApprove,
                card
            }
        }
    }
}

export default new SuggestedCardModerateButton()
