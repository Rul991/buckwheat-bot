import { characters } from "../../../../resources/duels/characters/characters"
import type { MethodGetDataOptions } from "../../../../types/skill-methods"
import ExperienceUtils from "../../../level/ExperienceUtils"
import BaseHealMethod from "./BaseHealMethod"

export default class PercentHealMethod extends BaseHealMethod {
    protected override _key: string = 'heal/percent'
    healCoef: number
    
    protected override async _getRawHealth(options: MethodGetDataOptions): Promise<number> {
        const {
            target,
        } = options

        const levelObject = await target.level.require()
        const level = ExperienceUtils.getLevelFromObject(levelObject)
        const user = await target.user.require()

        const maxHp = characters[user.className].getHealth(level)
        const addedHp = maxHp * this.healCoef

        return addedHp
    }

    constructor(coef: number) {
        super()
        this.healCoef = coef
    }
}