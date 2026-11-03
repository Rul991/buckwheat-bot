import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { type SkillBookMenuButtonData, SkillBookMenuButtonDataSchema } from "../../../../protos/skills_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import SkillPresenter from "../../../../utils/duel/skill/SkillPresenter"
import MessageUtils from "../../../../utils/bot/MessageUtils"

class SkillBookMenuButton extends CallbackQueryAction<SkillBookMenuButtonData> {
    override schema: GenMessage<SkillBookMenuButtonData> = SkillBookMenuButtonDataSchema
    override defaultTextKey: string = 'button/todo'
    override minimumRank: number = RankUtils.min
    override settingId: number = 186
    override name: string = 'skbmenu'
    
    protected override async _getId(options: CallbackQueryActionOptions<SkillBookMenuButtonData>): Promise<number | number[] | undefined> {
        return Number(options.data.id)
    }
    
    protected override async _execute(options: CallbackQueryActionOptions<SkillBookMenuButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            ctx
        } = options
        
        const {
            key,
            options: messageOptions
        } = await SkillPresenter.bookMenu(ctx)

        await MessageUtils.editText(
            ctx,
            key,
            messageOptions
        )
    }
}

export default new SkillBookMenuButton()
