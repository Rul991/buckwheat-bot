import { characters } from "../../../../resources/duels/characters/characters"
import type { MethodGetDataOptions } from "../../../../types/skill-methods"
import type { StartUp } from "../../../../types/types"
import CharacteristicsUtils from "../../chars/CharacteristicsUtils"

type GetByLevelOptions =
    & MethodGetDataOptions
    & {
        value: StartUp<number>
        calcTarget: 'caster' | 'target'
    }

type GetByPercentOptions =
    & MethodGetDataOptions
    & {
        coef: number
        functionKey?: 'getMana' | 'getHealth'
    }

export default class SkillMethodUtils {
    static async getValueByLevel(options: GetByLevelOptions) {
        const {
            [options.calcTarget]: calcTarget,
            value
        } = options
        const level = await calcTarget.level.require()

        return CharacteristicsUtils.calcStartUp(
            level,
            value
        )
    }

    static async getValueByCurrentHpAndPercent(options: GetByPercentOptions) {
        const {
            target,
            coef
        } = options

        const duelist = await target.duelist.require()
        const currentHp = duelist.hp
        const addedHp = currentHp * coef

        return addedHp
    }

    static async getValueByMaxCharAndPercent(options: GetByPercentOptions) {
        const {
            target,
            coef,
            functionKey = 'getHealth'
        } = options

        const level = await target.level.require()
        const user = await target.user.require()

        const maxValue = characters[user.className][functionKey](level)
        const addedValue = maxValue * coef

        return addedValue
    }
}