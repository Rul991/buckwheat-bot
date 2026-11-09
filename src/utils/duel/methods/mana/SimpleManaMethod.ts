import type { MethodGetDataOptions } from "../../../../types/skill-methods"
import BaseManaMethod from "./BaseManaMethod"

export default class SimpleManaMethod extends BaseManaMethod {
    protected override _key: string = 'mana/simple'
    mana: number

    protected override async _getRawData(_options: MethodGetDataOptions): Promise<number> {
        return this.mana
    }

    constructor(mana: number) {
        super()
        this.mana = mana
    }
}