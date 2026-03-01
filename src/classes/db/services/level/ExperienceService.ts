import ExperienceUtils from '../../../../utils/level/ExperienceUtils'
import LevelUtils from '../../../../utils/level/LevelUtils'
import { DUEL_EXPERIENCE, LEVEL_BOOST } from '../../../../utils/values/consts'
import { ExperienceWithId, FirstSecond, TopLevelObject } from '../../../../utils/values/types/types'
import LevelRepository from '../../repositories/LevelRepository'
import InventoryItemService from '../items/InventoryItemService'
import LevelService from './LevelService'

export default class ExperienceService {
    static async get(chatId: number, id: number): Promise<number> {
        const experience = await LevelService.create(chatId, id)

        return experience.experience ?? ExperienceUtils.min
    }

    static async getAllWithId(chatId: number): Promise<ExperienceWithId[]> {
        const levels = await LevelRepository.findManyInChat(chatId)

        return levels
            .map(
                lv => ({
                    id: lv.id,
                    experience: lv.experience ?? ExperienceUtils.min
                })
            )
    }

    static async set(chatId: number, id: number, experience: number): Promise<number> {
        await LevelRepository.updateOne(chatId, id, {
            experience: Math.floor(
                ExperienceUtils.clamp(experience)
            )
        })
        return experience
    }

    static async getBoostByLevelBoosts(chatId: number, id: number) {
        const levelBoosts = await InventoryItemService.getCount(
            chatId,
            id,
            'levelBoost'
        )

        return (levelBoosts * LEVEL_BOOST / 100) + 1
    }

    static async getAddedExperience(chatId: number, id: number, experience: number) {
        const boost = await this.getBoostByLevelBoosts(chatId, id)
        return Math.ceil(experience * boost)
    }

    static async add(chatId: number, id: number, experience = 1): Promise<number> {
        const currentExperience = await this.get(chatId, id)
        const addedExperience = await this.getAddedExperience(
            chatId,
            id,
            experience
        )

        await this.set(chatId, id, currentExperience + addedExperience)
        return addedExperience
    }

    static async isLevelUpAfterAdding(chatId: number, id: number, added = 1) {
        const currentExperience = await this.get(chatId, id)
        const addedExperience = await this.add(chatId, id, added)

        if (!ExperienceUtils.isNewLevel(currentExperience, added)) {
            return {
                experience: addedExperience,
                level: null
            }
        }

        const level = LevelUtils.get(currentExperience + added)
        return {
            experience: addedExperience,
            level
        }
    }
}