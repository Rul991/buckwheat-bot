import type Level from "../../db/entities/level/Level"
import MathUtils from "../math/MathUtils"

export default class LevelUtils {
    static min = 1
    static max = 99

    static multiplier = 1.95
    static firstLevelExperience = 90

    static clamp(level: number): number {
        return MathUtils.clamp(level, this.min, this.max)
    }

    static get(experience: number): number {
        return this.clamp(Math.floor(((experience + this.firstLevelExperience) ** (1 / this.multiplier)) / 10))
    }

    static getLevelUps({ 
        prevExperience, 
        currentExperience, 
        isLevelUpChecked 
    }: Pick<Level, 'prevExperience' | 'currentExperience' | 'isLevelUpChecked'>): [number, number] {
        const currentLevel = this.get(currentExperience)
        if(isLevelUpChecked) return [0, currentLevel]

        const prevLevel = this.get(prevExperience)
        return [currentLevel - prevLevel, currentLevel]
    }
}