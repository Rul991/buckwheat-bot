import type { MethodGetDataOptions } from "../../../../types/skill-methods"
import BaseDamageMethod from "./BaseDamageMethod"

export default class PercentDamageMethod extends BaseDamageMethod {
    protected override _key: string = 'damage/percent'
    coef: number

    protected override async _getRawDamage(options: MethodGetDataOptions): Promise<number> {
        const {
            target
        } = options
        const duelist = await target.duelist.require()
        const currentHp = duelist.hp

        return currentHp * this.coef
    }

    constructor(coef: number) {
        super()
        this.coef = coef
    }
}