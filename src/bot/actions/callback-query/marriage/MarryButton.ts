import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { type MarryButtonData, MarryButtonDataSchema } from "../../../../protos/marriage_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import UserService from "../../../../db/services/user/UserService"
import MarriageService from "../../../../db/services/marriage/MarriageService"
import MessageUtils from "../../../../utils/bot/MessageUtils"
import Marriage from "../../../../db/entities/marriage/Marriage"

class MarryButton extends CallbackQueryAction<MarryButtonData> {
    override schema: GenMessage<MarryButtonData> = MarryButtonDataSchema
    override defaultTextKey: string = 'marriage/button/marry'
    override minimumRank: number = RankUtils.min
    override settingId: number = 104
    override name: string = 'marry'

    protected override async _getId(options: CallbackQueryActionOptions<MarryButtonData>): Promise<number | number[] | undefined> {
        return Number(options.data.target)
    }

    protected override async _execute(options: CallbackQueryActionOptions<MarryButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            data,
            chatId,
            id: targetId,
            ctx
        } = options

        const {
            suggester: rawSuggesterId,
            isAccept
        } = data

        const suggesterId = Number(rawSuggesterId)
        const target = await ctx.vars.user.get()
        const suggester = targetId == suggesterId ? target : await UserService.get(chatId, suggesterId)

        if (!isAccept) {
            await Promise.all([
                MessageUtils.deleteMessages(ctx),
                MessageUtils.reply(
                    ctx,
                    'marriage/marry/decline',
                    {
                        vars: {
                            suggester,
                            target
                        }
                    }
                )
            ])
            return
        }

        const marriage = await MarriageService.get(
            chatId,
            targetId
        )
        const canMarry = !marriage

        if (!canMarry) {
            await MessageUtils.reply(
                ctx,
                'marriage/marry/cant-marry',
                {
                    vars: {
                        user: target
                    }
                }
            )
            return
        }

        await Promise.all([
            MarriageService.create(
                new Marriage({
                    chatId,
                    firstPartner: suggesterId,
                    secondPartner: targetId
                })
            ),
            MessageUtils.deleteMessages(ctx),
            MessageUtils.reply(
                ctx,
                'marriage/marry/accept',
                {
                    vars: {
                        suggester,
                        target
                    }
                }
            )
        ])
    }
}

export default new MarryButton()