import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { type SelectedSkillsMenuButtonData, SelectedSkillsMenuButtonDataSchema } from "../../../../protos/skills_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import MessageUtils from "../../../../utils/bot/MessageUtils"
import SkillPresenter from "../../../../utils/duel/skill/SkillPresenter"

class SelectedSkillsMenuButton extends CallbackQueryAction<SelectedSkillsMenuButtonData> {
    override schema: GenMessage<SelectedSkillsMenuButtonData> = SelectedSkillsMenuButtonDataSchema
    override defaultTextKey: string = 'skills/button/menu'
    override minimumRank: number = RankUtils.min
    override settingId: number = 180
    override name: string = 'skmenu'
    
    protected override async _getId(options: CallbackQueryActionOptions<SelectedSkillsMenuButtonData>): Promise<number | number[] | undefined> {
        return Number(options.data.id)
    }
    
    protected override async _execute(options: CallbackQueryActionOptions<SelectedSkillsMenuButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            ctx
        } = options

        const {
            key,
            options: messageOptions
        } = await SkillPresenter.menu(ctx)

        await MessageUtils.editText(
            ctx,
            key,
            messageOptions
        )
    }
}

export default new SelectedSkillsMenuButton()
