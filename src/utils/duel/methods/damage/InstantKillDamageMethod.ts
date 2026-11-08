import { characters } from "../../../../resources/duels/characters/characters"
import type { MethodGetDataOptions } from "../../../../types/skill-methods"
import BaseDamageMethod from "./BaseDamageMethod"

export default class InstantKillDamageMethod extends BaseDamageMethod {
    protected override _key: string = 'damage/instant'
    coef: number

    protected override async _getRawDamage(options: MethodGetDataOptions): Promise<number> {
        const {
            target,
        } = options

        const duelist = await target.duelist.require()
        const user = await target.user.require()
        const level = await target.level.require()

        const currentHp = duelist.hp
        const maxHp = characters[user.className].getHealth(level)
        const currentCoef = currentHp / maxHp

        return currentCoef <= this.coef ?
            currentHp :
            0
    }

    constructor(coef: number) {
        super()
        this.coef = coef
    }
}