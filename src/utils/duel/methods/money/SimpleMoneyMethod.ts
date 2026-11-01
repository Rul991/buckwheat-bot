import type { MethodGetDataOptions } from "../../../../types/skill-methods"
import BaseMoneyMethod from "./BaseMoneyMethod"

export default class SimpleMoneyMethod extends BaseMoneyMethod {
    protected override _key: string = 'money/simple'
    money: number

    protected override async _getRawMoney(_options: MethodGetDataOptions): Promise<number> {
        return this.money
    }

    constructor(money: number) {
        super()
        this.money = money
    }
}