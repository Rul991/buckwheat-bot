import ExperienceUtils from '../../../../utils/level/ExperienceUtils'
import LevelUtils from '../../../../utils/level/LevelUtils'
import { DUEL_EXPERIENCE } from '../../../../utils/values/consts'
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

    static async addExperienceAfterDuel(chatId: number, firstDuelist: number, secondDuelist: number) {
        const getLevel = async (id: number) => (
            await LevelService.get(chatId, id)
        )

        const getLevelBoost = async (id: number) => (
            (await InventoryItemService.use({
                chatId,
                id,
                itemId: 'levelBoost'
            }))[1]
        )

        const getLevelDiff = (first: keyof FirstSecond, second: keyof FirstSecond) => (
            level[first] / level[second]
        )

        const getAddedExperience = (key: keyof FirstSecond) => (
            levelDiff[key] * DUEL_EXPERIENCE * levelBoosts[key]
        )

        const level = {
            first: await getLevel(firstDuelist),
            second: await getLevel(secondDuelist),
        }

        const levelDiff = {
            first: getLevelDiff('first', 'second'),
            second: getLevelDiff('second', 'first'),
        }

        const levelBoosts = {
            first: await getLevelBoost(firstDuelist),
            second: await getLevelBoost(secondDuelist),
        }

        const addedExperience = {
            first: getAddedExperience('first'),
            second: getAddedExperience('second')
        }

        await this.add(chatId, firstDuelist, addedExperience.first)
        await this.add(chatId, firstDuelist, addedExperience.second)

        return addedExperience
    }
}