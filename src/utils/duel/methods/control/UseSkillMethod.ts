import type { GrullyI18nVars } from "@grully/i18n"
import type { MethodGetDataOptions, MethodPreCheckOptions, MethodExecuteOptions, MethodGetSuccessTextOptions } from "../../../../types/skill-methods"
import SkillRegistry from "../../skill/SkillRegistry"
import SkillMethod from "../base/SkillMethod"
import SelectedSkillsService from "../../../../db/services/duel/SelectedSkillsService"
import SkillExecutor from "../../skill/SkillExecutor"

export default class UseSkillMethod extends SkillMethod {
    protected override _key: string = 'control/use-skill'
    private readonly _notFoundSkillId = -1

    override getSuccessTextVars(options: MethodGetSuccessTextOptions): GrullyI18nVars {
        const {
            data,
            ctx
        } = options
        const skill = SkillRegistry.get(data)

        return {
            ...super.getSuccessTextVars(options),
            skill: skill?.getTitle(ctx)
        }
    }

    protected override async _getData(options: MethodGetDataOptions): Promise<number> {
        const {
            chatId,
            target
        } = options

        const skills = await SelectedSkillsService.getSkills(
            chatId,
            target.id
        )

        return skills[0]?.id ?? this._notFoundSkillId
    }

    protected override async _precheck(options: MethodPreCheckOptions): Promise<boolean> {
        const {
            data,
        } = options

        return data != this._notFoundSkillId
    }

    protected override async _execute(options: MethodExecuteOptions): Promise<void> {
        const {
            data: skillId,
            inUseSkillMethod
        } = options
        if(inUseSkillMethod) return

        const skill = SkillRegistry.get(skillId)
        if(!skill) return

        await SkillExecutor.execute({
            ...options,
            skill,
            inUseSkillMethod: true
        })
    }

}