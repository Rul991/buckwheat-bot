import ChosenSkills from '../../../interfaces/schemas/duels/ChosenSkills'
import ChoosedSkillsModel from '../models/ChosenSkillsModel'
import ChatIdRepository from './base/ChatIdRepository'

export default new ChatIdRepository<typeof ChoosedSkillsModel, ChosenSkills>(ChoosedSkillsModel)