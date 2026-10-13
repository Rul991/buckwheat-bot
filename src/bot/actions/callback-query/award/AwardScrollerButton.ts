import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { InlineKeyboard } from "grammy"
import type Award from "../../../../db/entities/award/Award"
import { type AwardScrollerButtonData, AwardScrollerButtonDataSchema } from "../../../../protos/award_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { ScrollerButtonEditMessageOptions } from "../../../../types/options"
import type { ScrollerButtonEditMessageResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import ScrollerButton from "../scroller/ScrollerButton"
import AwardShowButton from "./AwardShowButton"
import AwardService from "../../../../db/services/award/AwardService"
import UserService from "../../../../db/services/user/UserService"

class AwardScrollerButton extends ScrollerButton<Award, AwardScrollerButtonData> {
    override schema: GenMessage<AwardScrollerButtonData> = AwardScrollerButtonDataSchema
    override minimumRank: number = RankUtils.min
    override settingId: number = 131
    override name: string = 'awscr'

    protected override _isNeedCache: boolean = true
    protected override _objectsPerPage: number = 5

    protected override async _getRawObjects(options: CallbackQueryActionOptions<AwardScrollerButtonData>): Promise<Award[]> {
        const {
            chatId,
        } = options
        const ownerId = Number(options.data.ownerId)
        
        return await AwardService.getAllByUser(chatId, ownerId)
    }

    protected override async _getControlsButtonData(options: ScrollerButtonEditMessageOptions<Award, AwardScrollerButtonData>): Promise<Omit<AwardScrollerButtonData, "data" | "$typeName" | "$unknown">> {
        const {
            ownerId
        } = options.data

        return {
            ownerId
        }
    }

    protected override async _getKeyboard(options: ScrollerButtonEditMessageOptions<Award, AwardScrollerButtonData>): Promise<InlineKeyboard> {
        const keyboard = new InlineKeyboard()
        const {
            slicedObjects: awards,
            ctx,
            page,
        } = options
        const id = BigInt(options.id)

        for (const award of awards) {
            const awardId = award.awardId
            keyboard.add(
                AwardShowButton.button({
                    ctx,
                    data: {
                        id,
                        page,
                        awardId
                    },
                    vars: {
                        award
                    }
                })
            )
        }

        return keyboard.toFlowed(1)
    }

    protected override async _editMessage(options: ScrollerButtonEditMessageOptions<Award, AwardScrollerButtonData>): Promise<ScrollerButtonEditMessageResult> {
        const {
            data,
            chatId,
            id,
            objects,
            ctx
        } = options

        const ownerId = Number(data.ownerId)
        const owner = ownerId == id ?
            await ctx.vars.user.get() :
            await UserService.get(chatId, ownerId)
        const count = objects.length

        return {
            key: 'award/message/start',
            vars: {
                count,
                owner
            }
        }
    }
}

export default new AwardScrollerButton()