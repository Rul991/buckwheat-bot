import Level from '../../../../interfaces/schemas/user/Level'
import ExperienceUtils from '../../../../utils/level/ExperienceUtils'
import LevelUtils from '../../../../utils/level/LevelUtils'
import { TopLevelObject } from '../../../../utils/values/types/types'
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

    static async wipe(chatId: number): Promise<void> {
        await LevelRepository.updateMany(chatId, {
            $set: {
                experience: 0
            }
        })
    }
}