import ChoosedSkillsRepository from '../../repositories/ChosenSkillsRepository'

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
}