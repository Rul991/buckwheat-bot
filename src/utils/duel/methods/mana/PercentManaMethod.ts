import { characters } from "../../../../resources/duels/characters/characters"
import type { MethodGetDataOptions } from "../../../../types/skill-methods"
import ExperienceUtils from "../../../level/ExperienceUtils"
import BaseManaMethod from "./BaseManaMethod"

export default class PercentManaMethod extends BaseManaMethod {
    protected override _key: string = 'mana/percent'
    manaCoef: number
    
    protected override async _getRawMana(options: MethodGetDataOptions): Promise<number> {
        const {
            target,
        } = options

        const levelObject = await target.level.require()
        const level = ExperienceUtils.getLevelFromObject(levelObject)
        const user = await target.user.require()

        const maxMana = characters[user.className].getMana(level)
        const addedMana = maxMana * this.manaCoef

        return addedMana
    }

    constructor(coef: number) {
        super()
        this.manaCoef = coef
    }
}