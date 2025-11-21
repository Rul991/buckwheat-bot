import SkillAttack from '../../enums/SkillAttack'
import FileUtils from '../../utils/FileUtils'
import SkillUtils from '../../utils/SkillUtils'
import { FIRST_INDEX } from '../../utils/values/consts'
import { JavascriptTypes, MethodExecuteArguments, SkillMethodGetText } from '../../utils/values/types'
import ChosenSkillsService from '../db/services/choosedSkills/ChosenSkillsService'
import UserClassService from '../db/services/user/UserClassService'
import SkillMethod from './SkillMethod'

export default class extends SkillMethod<[number]> {
    args: JavascriptTypes[] = ['number']

    protected async _preCheck({
        args: [index],
        chatId,
        id,
    }: MethodExecuteArguments<[number]>): Promise<boolean> {
        const skills = await ChosenSkillsService.getSkills(chatId, id)
        const length = skills.length

        return index >= FIRST_INDEX && index < length
    }

    protected async _getSkill(chatId: number, id: number, index: number) {
        const skills = await ChosenSkillsService.getSkills(chatId, id)
        const skillId = skills[index]
        const type = await UserClassService.get(chatId, id)

        const skill = await SkillUtils.getSkillById(type, skillId)
        return skill
    }

    protected async _execute({
        args: [index],
        chatId,
        id,
        userId,
        ctx
    }: MethodExecuteArguments<[number]>): Promise<boolean> {
        const skill = await this._getSkill(chatId, id, index)
        if(!skill) return false
        
        const {
            isUsed
        } = await SkillUtils.useSkill({
            skill,
            attack: SkillAttack.Normal,
            ctx,
            userId,
            enemyId: id
        })
        
        return isUsed
    }

    async getText({
        args: [index]
    }: MethodExecuteArguments<[number]> & SkillMethodGetText): Promise<string> {
        return await FileUtils.readPugFromResource(
            'text/methods/use-skill-index.pug',
            {
                changeValues: {
                    index
                }
            }
        )
    }

}