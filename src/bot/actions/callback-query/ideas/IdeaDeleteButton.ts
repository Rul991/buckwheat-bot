import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { IdeaDeleteButtonDataSchema, type IdeaDeleteButtonData } from "../../../../protos/ideas_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import RankUtils from "../../../../utils/db/RankUtils"
import IdeaService from "../../../../db/services/ideas/IdeaService"
import MessageUtils from "../../../../utils/bot/MessageUtils"
import { startIdeaKeyboard } from "../../../keyboards/idea"

class IdeaDeleteButton extends CallbackQueryAction<IdeaDeleteButtonData> {
    protected override _rankCanBeChange: boolean = false
    override schema: GenMessage<IdeaDeleteButtonData> = IdeaDeleteButtonDataSchema
    override defaultTextKey: string = 'idea/delete-button'
    override minimumRank: number = RankUtils.min
    override settingId: number = 46
    override name: string = 'ideadel'

    protected override async _execute(options: CallbackQueryActionOptions<IdeaDeleteButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            id,
            data: {
                id: ideaId,
                page
            },
            ctx,
        } = options

        const isDelete = await IdeaService.delete(
            ideaId,
            id
        )

        if (isDelete) {
            const ideasCount = await IdeaService.count()
            if (ideasCount <= 0) {
                await MessageUtils.deleteMessages(ctx)
            }
            else {
                await MessageUtils.editText(
                    ctx,
                    'idea/start',
                    {
                        keyboard: await startIdeaKeyboard(ctx, { id, page })
                    }
                )
            }
        }

        return {
            key: 'idea/delete',
            vars: {
                isDelete,
                id: ideaId
            }
        }
    }
}

export default new IdeaDeleteButton()