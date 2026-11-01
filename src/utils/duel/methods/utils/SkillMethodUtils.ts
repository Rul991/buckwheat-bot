import { characters } from "../../../../resources/duels/characters/characters"
import type { MethodGetDataOptions } from "../../../../types/skill-methods"
import type { StartUp } from "../../../../types/types"
import ExperienceUtils from "../../../level/ExperienceUtils"
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
        const levelObject = await calcTarget.level.require()
        const level = ExperienceUtils.getLevelFromObject(levelObject)

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

    static async getValueByMaxHpAndPercent(options: GetByPercentOptions) {
        const {
            target,
            coef,
            functionKey = 'getHealth'
        } = options

        const levelObject = await target.level.require()
        const level = ExperienceUtils.getLevelFromObject(levelObject)
        const user = await target.user.require()

        const maxHp = characters[user.className][functionKey](level)
        const addedHp = maxHp * coef

        return addedHp
    }
}