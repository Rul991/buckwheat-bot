import SkillUtils from '../../../../utils/SkillUtils'
import { FIRST_INDEX } from '../../../../utils/values/consts'
import ChosenSkillsRepository from '../../repositories/ChosenSkillsRepository'
import ChoosedSkillsRepository from '../../repositories/ChosenSkillsRepository'
import DuelistService from '../duelist/DuelistService'

export default class {
    static async get(chatId: number, id: number) {
        const skills = await ChoosedSkillsRepository.findOne(chatId, id)
        if(skills) return skills
        else return await ChoosedSkillsRepository.create({
            id,
            chatId,
            skills: [],
            maxCount: 5
        })
    }

    static async getSkills(chatId: number, id: number): Promise<string[]> {
        const rawSkills =(await this.get(chatId, id)).skills
        const availableSkills = await SkillUtils.getAvailableSkills(chatId, id)

        const skills = rawSkills.filter(raw => {
            return availableSkills.some(available => raw == available.id)
        })

        if(rawSkills.length != skills.length) {
            await ChoosedSkillsRepository.updateOne(chatId, id, {
                skills
            })
        }

        return skills
    }

    static async addSkill(chatId: number, id: number, skillId: string): Promise<boolean> {
        if(await DuelistService.onDuel(chatId, id)) return false
        const userSkills = await this.getSkills(chatId, id)
        const chosenSkills = await this.get(chatId, id)
        let isAdded = false

        if(userSkills.some(v => v == skillId)) return false
        
        if(chosenSkills.maxCount > userSkills.length) {
            userSkills.push(skillId)
            isAdded = true
        }

        if(isAdded) {
            await ChoosedSkillsRepository.updateOne(chatId, id, {
                skills: userSkills
            })
        }

        return isAdded
    }

    static async removeSkill(chatId: number, id: number, index: number): Promise<boolean> {
        const skills = await this.getSkills(chatId, id)

        if(index < FIRST_INDEX || index >= skills.length)
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

    static async deleteChat(chatId: number) {
        return await ChosenSkillsRepository.deleteAllInChat(chatId)
    }
}