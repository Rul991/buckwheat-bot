import type { MethodGetDataOptions } from "../../../../../types/skill-methods"
import type { StartUp } from "../../../../../types/types"
import type Skill from "../../../skill/Skill"
import SkillMethodUtils from "../../utils/SkillMethodUtils"
import BaseEffectAddMethod from "./BaseEffectAddMethod"

export default class EffectLevelAddMethod extends BaseEffectAddMethod {
    protected override _key: string = 'effect/add/level'
    steps: StartUp<number>

    protected override async _getRawData(options: MethodGetDataOptions): Promise<number> {
        return await SkillMethodUtils.getValueByLevel({
            ...options,
            calcTarget: 'caster',
            value: this.steps
        })
    }

    constructor(
        skill: Skill,
        start: number,
        up: number,
    ) {
        super(skill)
        this.steps = {
            start,
            up
        }
    }
}