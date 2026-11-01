import type { MethodGetDataOptions } from "../../../../types/skill-methods"
import type { StartUp } from "../../../../types/types"
import BaseDamageMethod from "./BaseDamageMethod"
import SkillMethodUtils from "../utils/SkillMethodUtils"

export default class DamageLevelMethod extends BaseDamageMethod {
    protected override _key: string = 'damage/level'
    damage: StartUp<number>

    protected override async _getRawDamage(options: MethodGetDataOptions): Promise<number> {
        return await SkillMethodUtils.getValueByLevel({
            ...options,
            calcTarget: 'caster',
            value: this.damage
        })
    }

    constructor(damage: StartUp<number>) {
        super()
        this.damage = damage
    }
}