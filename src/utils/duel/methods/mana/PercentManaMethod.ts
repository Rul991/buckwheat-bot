import { characters } from "../../../../resources/duels/characters/characters"
import type { MethodGetDataOptions } from "../../../../types/skill-methods"
import BaseManaMethod from "./BaseManaMethod"

export default class PercentManaMethod extends BaseManaMethod {
    protected override _key: string = 'mana/percent'
    manaCoef: number
    
    protected override async _getRawData(options: MethodGetDataOptions): Promise<number> {
        const {
            target,
        } = options

        const level = await target.level.require()
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