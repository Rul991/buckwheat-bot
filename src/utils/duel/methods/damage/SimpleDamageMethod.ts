import type { MethodGetDataOptions } from "../../../../types/skill-methods"
import BaseDamageMethod from "./BaseDamageMethod"

export default class SimpleDamageMethod extends BaseDamageMethod {
    protected override _key: string = 'damage/simple'
    damage: number

    protected override async _getRawDamage(_options: MethodGetDataOptions): Promise<number> {
        return this.damage
    }

    constructor(damage: number) {
        super()
        this.damage = damage
    }
}