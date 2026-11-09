import { characters } from "../../../../resources/duels/characters/characters"
import type { MethodGetDataOptions } from "../../../../types/skill-methods"
import BaseDamageMethod from "./BaseDamageMethod"

export default class LostHealthDamageMethod extends BaseDamageMethod {
    protected override _key: string = 'damage/lost-hp'
    damage: number

    protected override async _getRawData(options: MethodGetDataOptions): Promise<number> {
        const {
            caster,
        } = options

        const duelist = await caster.duelist.require()
        const user = await caster.user.require()
        const level = await caster.level.require()

        const currentHp = duelist.hp
        const maxHp = characters[user.className].getHealth(level)

        return this.damage * (2 - currentHp / maxHp)
    }

    constructor(damage: number) {
        super()
        this.damage = damage
    }
}