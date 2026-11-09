import type { MethodGetDataOptions } from "../../../../types/skill-methods"
import BaseHealMethod from "./BaseHealMethod"

export default class SimpleHealMethod extends BaseHealMethod {
    protected override _key: string = 'heal/simple'
    hp: number

    protected override async _getRawData(_options: MethodGetDataOptions): Promise<number> {
        return this.hp
    }

    constructor(hp: number) {
        super()
        this.hp = hp
    }
}