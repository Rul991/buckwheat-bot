import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { type DuelSkillsButtonData, DuelSkillsButtonDataSchema } from "../../../../protos/duels_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import MessageUtils from "../../../../utils/bot/MessageUtils"
import { skillsDuelKeyboard } from "../../../keyboards/duel"
import SelectedSkillsService from "../../../../db/services/duel/SelectedSkillsService"

class DuelSkillsButton extends CallbackQueryAction<DuelSkillsButtonData> {
    override schema: GenMessage<DuelSkillsButtonData> = DuelSkillsButtonDataSchema
    override defaultTextKey: string = 'duel/button/skills'
    override minimumRank: number = RankUtils.min
    override settingId: number = 196
    override name: string = 'duelskills'

    protected override async _getId(options: CallbackQueryActionOptions<DuelSkillsButtonData>): Promise<number | number[] | undefined> {
        return await options.ctx.vars.duel.currentDuelist.get()
    }

    protected override async _execute(options: CallbackQueryActionOptions<DuelSkillsButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            ctx,
            chatId,
            id
        } = options
        const user = await ctx.vars.user.get()
        const skills = await SelectedSkillsService.getSkills(chatId, id)

        await MessageUtils.editText(
            ctx,
            'duel/message/skills/choose',
            {
                keyboard: await skillsDuelKeyboard(ctx, {}),
                vars: {
                    user,
                    skills
                }
            }
        )
    }
}

export default new DuelSkillsButton()
