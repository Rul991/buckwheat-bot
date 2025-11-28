import FileUtils from '../../utils/FileUtils'
import { FIRST_INDEX } from '../../utils/values/consts'
import { JavascriptTypes, MethodExecuteArguments, SkillMethodGetText } from '../../utils/values/types/types'
import ChosenSkillsService from '../db/services/choosedSkills/ChosenSkillsService'
import SkillMethod from './SkillMethod'

export default class extends SkillMethod<[number]> {
    args: JavascriptTypes[] = ['number']
    
    protected async _preCheck({
        chatId,
        id,
        args: [index]
    }: MethodExecuteArguments<[number]>): Promise<boolean> {
        const skills = await ChosenSkillsService.getSkills(chatId, id)
        const {
            length
        } = skills

        return index < length && index >= FIRST_INDEX
    }
    
    protected async _execute({
        chatId,
        id,
        args: [index]
    }: MethodExecuteArguments<[number]>): Promise<boolean> {
        return await ChosenSkillsService.removeSkill(chatId, id, index)
    }
    
    async getText({ 
        args: [index]
    }: MethodExecuteArguments<[number]> & SkillMethodGetText): Promise<string> {
        return await FileUtils.readPugFromResource(
            'text/methods/remove-skill.pug',
            {
                changeValues: {
                    index
                }
            }
        )
    }

}