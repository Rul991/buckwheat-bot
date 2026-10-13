import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { type AwardShowButtonData, AwardShowButtonDataSchema } from "../../../../protos/award_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import AwardService from "../../../../db/services/award/AwardService"
import MessageUtils from "../../../../utils/bot/MessageUtils"
import UserService from "../../../../db/services/user/UserService"
import type { BotContext } from "../../../../types/bot"
import type User from "../../../../db/entities/user/User"
import { showAwardKeyboard } from "../../../keyboards/award"
import TimeUtils from "../../../../utils/time/TimeUtils"

type GetUserOptions = {
    chatId: number
    id: number
    needId: number
    ctx: BotContext
}

class AwardShowButton extends CallbackQueryAction<AwardShowButtonData> {
    override schema: GenMessage<AwardShowButtonData> = AwardShowButtonDataSchema
    override defaultTextKey: string = 'award/button/show'
    override minimumRank: number = RankUtils.min
    override settingId: number = 129
    override name: string = 'awsh'

    protected override async _getId(options: CallbackQueryActionOptions<AwardShowButtonData>): Promise<number | number[] | undefined> {
        return Number(options.data.id)
    }

    protected async _getUser({ chatId, id, needId, ctx }: GetUserOptions): Promise<User | undefined> {
        return needId == id ?
            await ctx.vars.user.get() :
            await UserService.get(chatId, needId)
    }

    protected override async _execute(options: CallbackQueryActionOptions<AwardShowButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            data,
            ctx,
            id,
            chatId
        } = options

        const {
            awardId,
            page
        } = data

        const award = await AwardService.get(awardId)
        if (!award) {
            return {
                key: 'award/message/not-exist'
            }
        }

        const giver = await this._getUser({
            ctx,
            chatId,
            id,
            needId: award.giverId
        })

        const owner = await this._getUser({
            ctx,
            chatId,
            id,
            needId: award.id
        })

        await MessageUtils.editText(
            ctx,
            'award/message/show',
            {
                vars: {
                    award: {
                        ...award,
                        date: TimeUtils.formatMillisecondsToTime(
                            ctx,
                            TimeUtils.getElapsed(+award.createdAt)
                        )
                    },
                    giver,
                    owner
                },
                keyboard: await showAwardKeyboard(
                    ctx,
                    {
                        award,
                        page,
                        id
                    }
                )
            }
        )
    }
}

export default new AwardShowButton()