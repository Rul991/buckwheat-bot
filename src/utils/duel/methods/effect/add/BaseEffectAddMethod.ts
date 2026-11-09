import type { GrullyI18nVars } from "@grully/i18n"
import DuelEffectService from "../../../../../db/services/duel/DuelEffectService"
import type { MethodGetDataOptions, MethodPreCheckOptions, MethodExecuteOptions, MethodGetSuccessTextOptions } from "../../../../../types/skill-methods"
import type Skill from "../../../skill/Skill"
import SkillMethod from "../../base/SkillMethod"

export default abstract class BaseEffectAddMethod extends SkillMethod {
    protected abstract _getRawData(options: MethodGetDataOptions): Promise<number>
    skill: Skill

    protected override async _getData(options: MethodGetDataOptions): Promise<number> {
        const {
            boost
        } = options
        
        const data = await this._getRawData(options)
        return Math.floor(data * boost)
    }

    protected override async _precheck(_options: MethodPreCheckOptions): Promise<boolean> {
        return true
    }

    protected override async _execute(options: MethodExecuteOptions): Promise<void> {
        const {
            chatId,
            target,
            caster,
            data
        } = options

        await DuelEffectService.add({
            chatId,
            target: target.id,
            caster: caster.id,
            steps: data,
            skill: this.skill
        })
    }

    override getSuccessTextVars(options: MethodGetSuccessTextOptions): GrullyI18nVars {
        const {
            ctx
        } = options

        return {
            ...super.getSuccessTextVars(options),
            skill: this.skill.getTitle(ctx)
        }
    }

    constructor(skill: Skill) {
        super()
        this.skill = skill
    }
}