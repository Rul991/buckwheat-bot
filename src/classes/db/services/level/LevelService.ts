import Level from '../../../../interfaces/schemas/Level'
import ArrayUtils from '../../../../utils/ArrayUtils'
import ExperienceUtils from '../../../../utils/level/ExperienceUtils'
import LevelUtils from '../../../../utils/level/LevelUtils'
import { TopLevelObject } from '../../../../utils/values/types'
import LevelRepository from '../../repositories/LevelRepository'

export default class LevelService {
    static async create(id: number): Promise<Level> {
        const found = await LevelRepository.findOne(id)
        if(!found) return await LevelRepository.create({id})
        else return found
    }

    static async get(id: number): Promise<number> {
        const level = await this.create(id)

        return LevelUtils.get(level.experience ?? ExperienceUtils.min)
    }

    static async getAllSorted(): Promise<TopLevelObject[]> {
        const levels = await LevelRepository.findMany()

        return ArrayUtils.filterAndSort(levels, 'experience', 10)
            .map(lv => ({id: lv.id, level: LevelUtils.get(lv.experience ?? ExperienceUtils.min)}))
    }
}