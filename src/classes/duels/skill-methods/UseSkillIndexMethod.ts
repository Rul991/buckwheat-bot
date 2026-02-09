import FileUtils from '../../../utils/FileUtils'
import SkillUtils from '../../../utils/skills/SkillUtils'
import { MethodExecuteOptions, MethodGetTextOptions } from '../../../utils/values/types/skills'
import { JavascriptTypes } from '../../../utils/values/types/types'
import SkillService from '../../db/services/chosen-skills/SkillService'
import SkillMethod from './SkillMethod'

export default class extends SkillMethod<[number]> {
    args: JavascriptTypes[] = ['number']

    protected async _preCheck(options: MethodExecuteOptions<[number]>): Promise<boolean> {
        const {
            chatId,
            id,
            args: [index]
        } = options
        const skills = await SkillService.get(chatId, id)
        const skillId = skills[index]
        const skill = SkillUtils.getSkillById(skillId)

        return await SkillUtils.precheckSkill({
            ...options,
            skill
        })
    }

    protected async _execute(options: MethodExecuteOptions<[number]>): Promise<boolean> {
        const {
            chatId,
            id,
            args: [index]
        } = options
        const skills = await SkillService.get(chatId, id)
        const skillId = skills[index]
        const skill = SkillUtils.getSkillById(skillId)

        return await SkillUtils.executeSkill({
            ...options,
            skill
        })
    }

    protected async _getText({
        args: [index]
    }: MethodGetTextOptions<[number]>): Promise<string> {
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