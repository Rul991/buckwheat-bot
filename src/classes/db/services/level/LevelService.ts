import Level from '../../../../interfaces/schemas/Level'
import ArrayUtils from '../../../../utils/ArrayUtils'
import ExperienceUtils from '../../../../utils/level/ExperienceUtils'
import LevelUtils from '../../../../utils/level/LevelUtils'
import { TopLevelObject } from '../../../../utils/values/types'
import LevelRepository from '../../repositories/LevelRepository'

export default class LevelService {
    static async create(chatId: number, id: number): Promise<Level> {
        const found = await LevelRepository.findOne(chatId, id)
        if(!found) return await LevelRepository.create({chatId, id})
        else return found
    }

    static async get(chatId: number, id: number): Promise<number> {
        const level = await this.create(chatId, id)

        return LevelUtils.get(level.experience ?? ExperienceUtils.min)
    }

    static async getAllSorted(chatId: number): Promise<TopLevelObject[]> {
        const levels = await LevelRepository.findManyInChat(chatId)

        return ArrayUtils.filterAndSort(levels, 'experience', 10)
            .map(lv => ({id: lv.id, level: LevelUtils.get(lv.experience ?? ExperienceUtils.min)}))
    }
}