import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { type SkillRemoveButtonData, SkillRemoveButtonDataSchema } from "../../../../protos/skills_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import SkillRegistry from "../../../../utils/duel/skill/SkillRegistry"
import SelectedSkillsService from "../../../../db/services/duel/SelectedSkillsService"

class SkillRemoveButton extends CallbackQueryAction<SkillRemoveButtonData> {
    override schema: GenMessage<SkillRemoveButtonData> = SkillRemoveButtonDataSchema
    override defaultTextKey: string = 'skills/button/remove'
    override minimumRank: number = RankUtils.min
    override settingId: number = 185
    override name: string = 'skrem'
    
    protected override async _getId(options: CallbackQueryActionOptions<SkillRemoveButtonData>): Promise<number | number[] | undefined> {
        return Number(options.data.id)
    }
    
    protected override async _execute(options: CallbackQueryActionOptions<SkillRemoveButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            data,
            chatId,
            id,
            ctx
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

        const isRemoved = await SelectedSkillsService.remove({
            chatId,
            id,
            skill
        })

        return {
            key: `skills/message/remove/${isRemoved ? 'done' : 'fail'}`,
            vars: {
                skill: skill.getTitle(ctx)
            }
        }
    }
}

export default new SkillRemoveButton()
