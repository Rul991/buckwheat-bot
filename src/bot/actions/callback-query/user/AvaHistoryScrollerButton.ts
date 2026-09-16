import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import type AvaHistory from "../../../../db/entities/user/AvaHistory"
import { BaseScrollerDataSchema, type BaseScrollerData } from "../../../../protos/scroller_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { ScrollerButtonEditMessageOptions } from "../../../../types/options"
import type { ScrollerButtonEditMessageResult } from "../../../../types/results"
import ScrollerButton from "../scroller/ScrollerButton"
import RankUtils from "../../../../utils/db/RankUtils"
import UserService from "../../../../db/services/user/UserService"
import TimeUtils from "../../../../utils/time/TimeUtils"

class AvaHistoryScrollerButton extends ScrollerButton<AvaHistory> {
    override schema: GenMessage<BaseScrollerData> = BaseScrollerDataSchema
    override minimumRank: number = RankUtils.min
    override settingId: number = 80
    protected override _objectsPerPage: number = 1
    override name: string = 'avascr'
    
    protected override async _getRawObjects(options: CallbackQueryActionOptions<BaseScrollerData>): Promise<AvaHistory[]> {
        const {
            chatId,
            id
        } = options

        const user = await UserService.get(chatId, id)
        return user?.avaHistory ?? []
    }
    protected override async _editMessage(options: ScrollerButtonEditMessageOptions<AvaHistory, BaseScrollerData>): Promise<ScrollerButtonEditMessageResult> {
        const {
            slicedObjects: [ava],
            page,
            ctx
        } = options

        const date = ava?.createdAt ?? new Date()
        const elapsedTime = TimeUtils.getElapsed(+date)

        return {
            key: 'ava/show',
            vars: {
                ava,
                elapsedTime: TimeUtils.formatMillisecondsToTime(ctx, elapsedTime),
                page,
                isCurrent: ava?.fileId == ctx.vars.user?.currentAva?.fileId,
                user: ctx.vars.user
            },
            media: ava?.fileId ?
                ava :
                undefined
        }
    }
}

export default new AvaHistoryScrollerButton()