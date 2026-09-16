import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import Idea from "../../../../db/entities/ideas/Idea"
import { BaseScrollerDataSchema, type BaseScrollerData } from "../../../../protos/scroller_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { ScrollerButtonEditMessageOptions } from "../../../../types/options"
import type { ScrollerButtonEditMessageResult } from "../../../../types/results"
import ScrollerButton from "../scroller/ScrollerButton"
import IdeaService from "../../../../db/services/ideas/IdeaService"
import RankUtils from "../../../../utils/db/RankUtils"
import { InlineKeyboard } from "grammy"
import IdeaVoteButton from "./IdeaVoteButton"
import IdeaDeleteButton from "./IdeaDeleteButton"

type Object = Idea

class IdeaScrollerButton extends ScrollerButton<Object> {
    override schema: GenMessage<BaseScrollerData> = BaseScrollerDataSchema
    protected override _rankCanBeChange: boolean = false
    override minimumRank: number = RankUtils.min
    override settingId: number = 44
    protected override _objectsPerPage: number = 1
    override name: string = 'ideascr'

    protected override async _getKeyboard(options: ScrollerButtonEditMessageOptions<Idea, BaseScrollerData>): Promise<InlineKeyboard> {
        const {
            ctx,
            id,
            slicedObjects: [rawIdea],
        } = options

        const idea = rawIdea ?? Idea.dummy()
        const result = new InlineKeyboard()

        const data = {
            id: idea.id,
            userId: BigInt(id)
        }

        if (Idea.canDelete(idea, id)) {
            result.add(
                IdeaDeleteButton.button({
                    ctx,
                    data: {
                        id: idea.id
                    },
                    style: 'danger'
                })
            )
            result.row()
        }

        result.add(
            IdeaVoteButton.button({
                ctx,
                data: {
                    ...data,
                    isCool: true,
                },
            }),
            IdeaVoteButton.button({
                ctx,
                data: {
                    ...data,
                    isCool: false,
                },
            }),
        )

        return result
    }

    protected override async _getRawObjects(_options: CallbackQueryActionOptions<BaseScrollerData>): Promise<Idea[]> {
        return await IdeaService.getAll()
    }
    protected override async _editMessage(options: ScrollerButtonEditMessageOptions<Idea, BaseScrollerData>): Promise<ScrollerButtonEditMessageResult> {
        const {
            slicedObjects: [rawIdea],
            ctx
        } = options

        const idea = rawIdea ?? Idea.dummy()
        return await Idea.message({
            idea,
            ctx
        })
    }
}

export default new IdeaScrollerButton()