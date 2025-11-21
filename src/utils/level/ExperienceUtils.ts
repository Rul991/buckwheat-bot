import MathUtils from '../MathUtils'
import LevelUtils from './LevelUtils'

export default class ExperienceUtils {
    static min = this.get(LevelUtils.min)
    static max = this.get(LevelUtils.max + 1)
    
    static clamp(exp: number): number {
        return MathUtils.clamp(exp, this.min, this.max)
    }

    static get(level: number): number {
        return Math.ceil((level * 10) ** LevelUtils.multiplier) - LevelUtils.firstLevelExperience
    }

    static add(currentExperience: number, newExperience: number): number {
        return this.clamp(currentExperience + newExperience)
    }

    static isNewLevel(current: number, added: number) {
        const currentLevel = LevelUtils.get(current)
        const newLevel = LevelUtils.get(this.add(current, added))

        return newLevel > currentLevel
    }

    static getNeedExperienceToLevelUp(experience: number): number {
        let level = LevelUtils.get(experience)
        return this.get(level + 1) - experience
    }

    static precents(currentExperience: number): number {
        const currentLevel = LevelUtils.get(currentExperience)
        const currentLevelExperience = ExperienceUtils.get(currentLevel)
        const nextLevelExperience = ExperienceUtils.get(currentLevel + 1)

        const experienceDiff = nextLevelExperience - currentLevelExperience
        const progress = currentExperience - currentLevelExperience
        const precents = (progress / experienceDiff)

        return isFinite(precents) ? precents : 0
    }

}