import type { GrullyI18nVars } from "@grully/i18n"
import type { MethodGetDataOptions, MethodPreCheckOptions, MethodExecuteOptions, MethodGetSuccessTextOptions } from "../../../../../types/skill-methods"
import type Skill from "../../../skill/Skill"
import SkillMethod from "../../base/SkillMethod"
import DuelEffectService from "../../../../../db/services/duel/DuelEffectService"

export default class DeleteEffectsMethod extends SkillMethod {
    protected override _key: string = 'effect/other/delete'
    skills: Skill[]
    forEvery: boolean

    protected override async _getData(_options: MethodGetDataOptions): Promise<number> {
        return 0
    }

    protected override async _precheck(_options: MethodPreCheckOptions): Promise<boolean> {
        return true
    }

    protected override async _execute(options: MethodExecuteOptions): Promise<void> {
        const {
            chatId,
            target,
            caster
        } = options

        const duelists = this.forEvery ?
            [
                target.id,
                caster.id
            ] :
            [
                target.id
            ]

        if (!this.skills.length) {
            await DuelEffectService.deleteByDuelists(
                chatId,
                duelists
            )
            return
        }

        await DuelEffectService.deleteBySkillsAndDuelists(
            chatId,
            this.skills,
            duelists
        )
    }

    override getSuccessTextVars(options: MethodGetSuccessTextOptions): GrullyI18nVars {
        const {
            ctx
        } = options

        return {
            ...super.getSuccessTextVars(options),
            skills: this.skills.map(
                v => {
                    return v.getTitle(ctx)
                }
            ),
            forEvery: this.forEvery
        }
    }

    constructor(
        skills: Skill[],
        forEvery: boolean
    ) {
        super()
        this.skills = skills
        this.forEvery = forEvery
    }
}