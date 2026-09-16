import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import { IdeaVoteButtonDataSchema, type IdeaVoteButtonData } from "../../../../protos/ideas_pb"
import RankUtils from "../../../../utils/db/RankUtils"
import IdeaService from "../../../../db/services/ideas/IdeaService"
import IdeaVote from "../../../../db/entities/ideas/IdeaVote"
import MessageUtils from "../../../../utils/bot/MessageUtils"
import Idea from "../../../../db/entities/ideas/Idea"

class IdeaVoteButton extends CallbackQueryAction<IdeaVoteButtonData> {
    protected override _rankCanBeChange: boolean = false
    override schema: GenMessage<IdeaVoteButtonData> = IdeaVoteButtonDataSchema
    override defaultTextKey: string = 'idea/vote'
    override minimumRank: number = RankUtils.min
    override settingId: number = 45
    override name: string = 'ideavote'

    protected override async _execute(options: CallbackQueryActionOptions<IdeaVoteButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            id,
            data: {
                isCool,
                id: ideaId
            },
            ctx
        } = options

        const voteResult = await IdeaService.vote(
            ideaId,
            new IdeaVote({
                id,
                isCool
            })
        )

        if(voteResult.ok) {
            const {
                key,
                vars,
                keyboard
            } = await Idea.message({
                idea: voteResult.idea,
                ctx,
            })

            await MessageUtils.editText(
                ctx,
                key,
                {
                    vars,
                    keyboard
                }
            )

            return {
                key: 'idea/vote',
                vars: {
                    isCool,
                    newVote: voteResult.newVote
                }
            }
        }

        return {
            key: `idea/${voteResult.reason}`
        }
    }
}

export default new IdeaVoteButton()