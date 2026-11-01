import type { MethodGetDataOptions } from "../../../../types/skill-methods"
import type { StartUp } from "../../../../types/types"
import BaseMoneyMethod from "./BaseMoneyMethod"
import SkillMethodUtils from "../utils/SkillMethodUtils"

export default class MoneyLevelMethod extends BaseMoneyMethod {
    protected override _key: string = 'money/level'
    money: StartUp<number>

    protected override async _getRawMoney(options: MethodGetDataOptions): Promise<number> {
        return await SkillMethodUtils.getValueByLevel({
            ...options,
            calcTarget: 'caster',
            value: this.money
        })
    }

    constructor(money: StartUp<number>) {
        super()
        this.money = money
    }
}