import type Level from '../../db/entities/level/Level'
import MathUtils from '../math/MathUtils'
import LevelUtils from './LevelUtils'

export default class ExperienceUtils {
    static min = this.get(LevelUtils.min)
    static max = Infinity
    
    static clamp(exp: number): number {
        return MathUtils.clamp(exp, this.min, this.max)
    }

    static get(level: number): number {
        return Math.ceil((level * 10) ** LevelUtils.multiplier) - LevelUtils.firstLevelExperience
    }

    static add(currentExperience: number, newExperience: number): number {
        return this.clamp(currentExperience + newExperience)
    }

    static getRemainingExperienceToLevelUp(experience: number): number {
        let level = LevelUtils.get(experience)
        return this.get(level + 1) - experience
    }

    static getLevelFromObject(level: Level | undefined): number {
        return LevelUtils.get(level?.currentExperience ?? this.min)
    }

    static precents(currentExperience: number): number {
        const currentLevel = LevelUtils.get(currentExperience)
        const currentLevelExperience = ExperienceUtils.get(currentLevel)
        const nextLevelExperience = ExperienceUtils.get(currentLevel + 1)

        const experienceDiff = nextLevelExperience - currentLevelExperience
        const progress = currentExperience - currentLevelExperience
        const precents = progress / experienceDiff

        return isFinite(precents) ? precents : 0
    }
}