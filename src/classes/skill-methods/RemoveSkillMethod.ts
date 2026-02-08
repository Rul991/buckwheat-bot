import FileUtils from '../../utils/FileUtils'
import { MethodExecuteOptions, MethodGetTextOptions } from '../../utils/values/types/skills'
import { JavascriptTypes } from '../../utils/values/types/types'
import SkillService from '../db/services/chosen-skills/SkillService'
import SkillMethod from './SkillMethod'

export default class extends SkillMethod<[number]> {
    args: JavascriptTypes[] = ['number']

    protected async _preCheck({
        chatId,
        id,
        args: [index]
    }: MethodExecuteOptions<[number]>): Promise<boolean> {
        return await SkillService.hasByIndex(
            chatId,
            id,
            index
        )
    }

    protected async _execute({
        chatId,
        id,
        args: [index]
    }: MethodExecuteOptions<[number]>): Promise<boolean> {
        return await SkillService.remove(
            chatId,
            id,
            index
        )
    }

    protected async _getText({
        args: [index]
    }: MethodGetTextOptions<[number]>): Promise<string> {
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