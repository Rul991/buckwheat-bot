import type { MethodGetDataOptions } from "../../types/duels"
import CharacteristicsUtils from "../../utils/duel/CharacteristicsUtils"
import ExperienceUtils from "../../utils/level/ExperienceUtils"
import DamageMethod from "./DamageMethod"

export default class AttackMethod extends DamageMethod {
    protected _upDamage: number

    constructor(start: number, up: number) {
        super(start)
        this._upDamage = up
    }

    protected override async _getData(options: MethodGetDataOptions): Promise<number> {
        const {
            ctx,
            boost,
        } = options
        const level = ExperienceUtils.getLevelFromObject(ctx.vars.level)

        return CharacteristicsUtils.calcStartUp(
            level, 
            {
                start: this._damage,
                up: this._upDamage
            }
        ) * boost
    }
}