import ExperienceUtils from '../../../../utils/level/ExperienceUtils'
import LevelUtils from '../../../../utils/level/LevelUtils'
import LevelRepository from '../../repositories/LevelRepository'
import LevelService from './LevelService'

export default class ExperienceService {
    static async get(chatId: number, id: number): Promise<number> {
        const experience = await LevelService.create(chatId, id)

        return experience.experience ?? ExperienceUtils.min
    }

    static async set(chatId: number, id: number, experience: number): Promise<number> {
        await LevelRepository.updateOne(chatId, id, {experience: ExperienceUtils.clamp(experience)})
        return experience
    }

    static async add(chatId: number, id: number, experience = 1): Promise<number> {
        const currentExperience = await this.get(chatId, id)
        return await this.set(chatId, id, currentExperience + experience)
    }

    static async isLevelUpAfterAdding(chatId: number, id: number, added = 1): Promise<number | null> {
        const currentExperience = await this.get(chatId, id)
        await this.add(chatId, id, added)

        return ExperienceUtils.isNewLevel(currentExperience, added) ? 
            LevelUtils.get(currentExperience + added) :
            null
    }
}