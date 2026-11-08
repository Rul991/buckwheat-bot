import { characters } from "../../../../resources/duels/characters/characters"
import type { MethodGetDataOptions } from "../../../../types/skill-methods"
import BaseHealMethod from "./BaseHealMethod"

export default class NoHpHealMethod extends BaseHealMethod {
    protected override _key: string = 'heal/no-hp'
    coef: number

    protected override async _getRawHealth(options: MethodGetDataOptions): Promise<number> {
        const {
            target
        } = options
        const duelist = await target.duelist.require()
        const hp = duelist.hp

        if(hp > 0) {
            return 0
        }
        
        const user = await target.user.require()
        const level = await target.level.require()

        const maxHp = characters[user.className].getHealth(level)
        const newHp = maxHp * this.coef

        return newHp
    }

    constructor(coef: number) {
        super()
        this.coef = coef
    }
}