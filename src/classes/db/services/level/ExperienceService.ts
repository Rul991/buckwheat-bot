import ExperienceUtils from '../../../../utils/level/ExperienceUtils'
import LevelUtils from '../../../../utils/level/LevelUtils'
import LevelRepository from '../../repositories/LevelRepository'
import LevelService from './LevelService'

export default class ExperienceService {
    static async get(id: number): Promise<number> {
        const experience = await LevelService.create(id)

        return experience.experience ?? ExperienceUtils.min
    }

    static async set(id: number, experience: number): Promise<number> {
        await LevelRepository.updateOne(id, {experience})
        return experience
    }

    static async add(id: number, experience = 1): Promise<number> {
        const currentExperience = await this.get(id)
        return await this.set(id, currentExperience + experience)
    }

    static async isLevelUpAfterAdding(id: number, added = 1): Promise<number | null> {
        const currentExperience = await this.get(id)
        await this.add(id, added)

        return ExperienceUtils.isNewLevel(currentExperience, added) ? 
            LevelUtils.get(currentExperience + added) :
            null
    }
}