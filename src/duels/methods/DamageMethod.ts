import type { MethodGetDataOptions, MethodPreCheckOptions, MethodExecuteOptions } from "../../types/duels"
import SkillMethod from "./SkillMethod"

export default class DamageMethod extends SkillMethod {
    protected override _key: string = 'damage'
    protected _damage: number

    constructor(damage: number) {
        super()
        this._damage = damage
    }

    protected override async _getData(options: MethodGetDataOptions): Promise<number> {
        const {
            boost
        } = options

        return boost * this._damage
    }

    protected override async _precheck(_options: MethodPreCheckOptions): Promise<boolean> {
        return true
    }

    protected override async _execute(options: MethodExecuteOptions): Promise<void> {
        const {
            
        } = options
    }

}