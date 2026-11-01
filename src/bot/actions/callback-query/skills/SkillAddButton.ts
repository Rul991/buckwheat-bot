import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { type SkillAddButtonData, SkillAddButtonDataSchema } from "../../../../protos/skills_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import SkillRegistry from "../../../../utils/duel/skill/SkillRegistry"
import SelectedSkillsService from "../../../../db/services/duel/SelectedSkillsService"
import ExperienceUtils from "../../../../utils/level/ExperienceUtils"

class SkillAddButton extends CallbackQueryAction<SkillAddButtonData> {
    override schema: GenMessage<SkillAddButtonData> = SkillAddButtonDataSchema
    override defaultTextKey: string = 'button/add'
    override minimumRank: number = RankUtils.min
    override settingId: number = 184
    override name: string = 'skadd'
    
    protected override async _getId(options: CallbackQueryActionOptions<SkillAddButtonData>): Promise<number | number[] | undefined> {
        return Number(options.data.id)
    }
    
    protected override async _execute(options: CallbackQueryActionOptions<SkillAddButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            data,
            ctx,
            chatId,
            id
        } = options

        const {
            skillId
        } = data

        const skill = SkillRegistry.get(skillId)
        if(!skill) {
            return {
                key: 'skills/message/not-exist'
            }
        }

        const user = await ctx.vars.user.require()
        const className = user.className

        const levelObject = await ctx.vars.level.get()
        const level = ExperienceUtils.getLevelFromObject(levelObject)

        const canAdd = await SelectedSkillsService.canAdd({
            chatId,
            id,
            className,
            level,
            skill
        })
        if(!canAdd) {
            return {
                key: 'skills/message/add/fail'
            }
        }

        await SelectedSkillsService.add({
            chatId,
            id,
            skill
        })

        return {
            key: 'skills/message/add/done',
            vars: {
                skill: skill.getTitle(ctx)
            }
        }
    }
}

export default new SkillAddButton()
