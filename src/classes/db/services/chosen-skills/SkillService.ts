import SkillUtils from '../../../../utils/skills/SkillUtils'
import { FIRST_INDEX } from '../../../../utils/values/consts'
import ChosenSkillsRepository from '../../repositories/ChosenSkillsRepository'
import DuelCheckService from '../duel/DuelCheckService'
import DuelistService from '../duelist/DuelistService'
import LevelService from '../level/LevelService'
import UserClassService from '../user/UserClassService'
import ChosenSkillsService from './ChosenSkillsService'

export default class {
    static async getAvailableSkills(chatId: number, id: number) {
        const level = await LevelService.get(chatId, id)
        const type = await UserClassService.get(chatId, id)

        return SkillUtils.getAvailableSkills(type, level)
    }

    static async get(chatId: number, id: number): Promise<string[]> {
        const rawSkills = (await ChosenSkillsService.get(chatId, id)).skills
        const availableSkills = await this.getAvailableSkills(chatId, id)

        const skills = rawSkills.filter(raw => {
            return availableSkills.some(available => raw == available.id)
        })

        if (rawSkills.length != skills.length) {
            await ChosenSkillsRepository.updateOne(chatId, id, {
                skills
            })
        }

        return skills
    }

    static async add(chatId: number, id: number, skillId: string): Promise<boolean> {
        if (await DuelCheckService.onDuel(chatId, id)) return false
        const userSkills = await this.get(chatId, id)
        const chosenSkills = await ChosenSkillsService.get(chatId, id)
        let isAdded = false

        if (userSkills.some(v => v == skillId)) return false

        if (chosenSkills.maxCount > userSkills.length) {
            userSkills.push(skillId)
            isAdded = true
        }

        if (isAdded) {
            await ChosenSkillsRepository.updateOne(chatId, id, {
                skills: userSkills
            })
        }

        return isAdded
    }

    static async remove(chatId: number, id: number, index: number): Promise<boolean> {
        const skills = await this.get(chatId, id)

        if (index < FIRST_INDEX || index >= skills.length)
            return false

        skills.splice(index, 1)
        await ChosenSkillsRepository.updateOne(
            chatId,
            id,
            {
                skills: skills
            }
        )

        return true
    }
}