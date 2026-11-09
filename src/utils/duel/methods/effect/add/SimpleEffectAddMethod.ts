import type { MethodGetDataOptions } from "../../../../../types/skill-methods"
import type Skill from "../../../skill/Skill"
import BaseEffectAddMethod from "./BaseEffectAddMethod"

export default class SimpleEffectAddMethod extends BaseEffectAddMethod {
    protected override _key: string = 'effect/add/simple'
    steps: number

    protected override async _getRawData(_options: MethodGetDataOptions): Promise<number> {
        return this.steps
    }

    constructor(
        skill: Skill,
        steps: number
    ) {
        super(skill)
        this.steps = steps
    }
}