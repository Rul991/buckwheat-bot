import { characters } from "../../../../resources/duels/characters/characters"
import type { MethodGetDataOptions } from "../../../../types/skill-methods"
import ExperienceUtils from "../../../level/ExperienceUtils"
import BaseDamageMethod from "./BaseDamageMethod"

export default class LostHealthDamageMethod extends BaseDamageMethod {
    protected override _key: string = 'damage/lost-hp'
    damage: number

    protected override async _getRawDamage(options: MethodGetDataOptions): Promise<number> {
        const {
            caster,
        } = options

        const duelist = await caster.duelist.require()
        const user = await caster.user.require()

        const levelObject = await caster.level.require()
        const level = ExperienceUtils.getLevelFromObject(levelObject)

        const currentHp = duelist.hp
        const maxHp = characters[user.className].getHealth(level)

        return this.damage * (2 - currentHp / maxHp)
    }

    constructor(damage: number) {
        super()
        this.damage = damage
    }
}