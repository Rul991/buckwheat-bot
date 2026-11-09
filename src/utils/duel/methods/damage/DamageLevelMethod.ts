import type { MethodGetDataOptions } from "../../../../types/skill-methods"
import type { StartUp } from "../../../../types/types"
import BaseDamageMethod from "./BaseDamageMethod"
import SkillMethodUtils from "../utils/SkillMethodUtils"

export default class DamageLevelMethod extends BaseDamageMethod {
    protected override _key: string = 'damage/level'
    damage: StartUp<number>

    protected override async _getRawData(options: MethodGetDataOptions): Promise<number> {
        return await SkillMethodUtils.getValueByLevel({
            ...options,
            calcTarget: 'caster',
            value: this.damage
        })
    }

    constructor(start: number, up: number) {
        super()
        this.damage = {
            start,
            up
        }
    }
}