import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { SkillBookScrollerType, type SkillShowButtonData, SkillShowButtonDataSchema, SkillShowType } from "../../../../protos/skills_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import SkillRegistry from "../../../../utils/duel/skill/SkillRegistry"
import MessageUtils from "../../../../utils/bot/MessageUtils"
import SkillPresenter from "../../../../utils/duel/skill/SkillPresenter"
import type { BotContext } from "../../../../types/bot"
import { addSkillKeyboard, selectedSkillKeyboard, skillBookShowKeyboard } from "../../../keyboards/skills"
import { skillUseShowDuelKeyboard } from "../../../keyboards/duel"

class SkillShowButton extends CallbackQueryAction<SkillShowButtonData> {
    override schema: GenMessage<SkillShowButtonData> = SkillShowButtonDataSchema
    override defaultTextKey: string = 'skills/button/title'
    override minimumRank: number = RankUtils.min
    override settingId: number = 181
    override name: string = 'skshow'
    
    protected override async _getId(options: CallbackQueryActionOptions<SkillShowButtonData>): Promise<number | number[] | undefined> {
        return Number(options.data.id)
    }

    private async _getKeyboard(ctx: BotContext<SkillShowButtonData>) {
        const id = ctx.vars.id
        const {
            page = 0,
            skillId,
            type,
            scrollerType = SkillBookScrollerType.Knight
        } = ctx.actionData

        const skill = SkillRegistry.get(skillId)
        if(!skill) return undefined

        if(type == SkillShowType.Duel) {
            return await skillUseShowDuelKeyboard(
                ctx,
                {
                    skillId
                }
            )
        }
        else if(type == SkillShowType.Add) {
            return await addSkillKeyboard(
                ctx,
                {
                    id,
                    page,
                    skillId
                }
            )
        }
        else if(type == SkillShowType.Selected) {
            return await selectedSkillKeyboard(
                ctx,
                {
                    id,
                    skillId
                }
            )
        }
        else if(type == SkillShowType.Book) {
            return await skillBookShowKeyboard(
                ctx,
                {
                    id,
                    page,
                    type: scrollerType
                }
            )
        }

        return undefined
    }
    
    protected override async _execute(options: CallbackQueryActionOptions<SkillShowButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            data,
            ctx
        } = options

        const {
            skillId,
            type,
        } = data

        const skill = SkillRegistry.get(skillId)
        if(!skill) {
            return {
                key: 'skills/message/not-exist'
            }
        }

        const {
            key,
            vars
        } = await SkillPresenter.show({
            ctx,
            showType: type == SkillShowType.Duel ? 'duel' : 'info',
            skill
        })

        await MessageUtils.editText(
            ctx,
            key,
            {
                vars,
                keyboard: await this._getKeyboard(ctx)
            }
        )
    }
}

export default new SkillShowButton()
