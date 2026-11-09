import type { MethodGetDataOptions } from "../../../../types/skill-methods"
import RandomUtils from "../../../math/RandomUtils"
import BaseDamageMethod from "./BaseDamageMethod"

export default class RandomDamageMethod extends BaseDamageMethod {
    protected override _key: string = 'damage/random'
    damage: { min: number, max: number }

    protected override async _getRawData(_options: MethodGetDataOptions): Promise<number> {
        const { min, max } = this.damage
        return RandomUtils.range(min, max)
    }

    constructor(min: number, max: number) {
        super()
        this.damage = {
            min,
            max
        }
    }
}