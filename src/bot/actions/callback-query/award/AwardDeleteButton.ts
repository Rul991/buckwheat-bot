import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { type AwardDeleteButtonData, AwardDeleteButtonDataSchema } from "../../../../protos/award_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import AwardService from "../../../../db/services/award/AwardService"

class AwardDeleteButton extends CallbackQueryAction<AwardDeleteButtonData> {
    override schema: GenMessage<AwardDeleteButtonData> = AwardDeleteButtonDataSchema
    override defaultTextKey: string = 'button/delete'
    override minimumRank: number = RankUtils.min
    override settingId: number = 130
    override name: string = 'awdel'

    protected override async _getId(options: CallbackQueryActionOptions<AwardDeleteButtonData>): Promise<number | number[] | undefined> {
        return Number(options.data.id)
    }

    protected override async _execute(options: CallbackQueryActionOptions<AwardDeleteButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            data,
            id
        } = options

        const {
            awardId
        } = data

        const award = await AwardService.get(awardId)
        if (!award) {
            return {
                key: 'award/message/not-exist'
            }
        }

        if(award.giverId != id) {
            return {
                key: 'award/message/cant-delete'
            }
        }

        const isDeleted = await AwardService.delete(awardId)
        if (!isDeleted) {
            return {
                key: 'award/message/not-exist'
            }
        }

        return {
            key: 'award/message/deleted'
        }
    }
}

export default new AwardDeleteButton()