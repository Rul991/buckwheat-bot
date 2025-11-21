import FileUtils from '../../utils/FileUtils'
import SkillUtils from '../../utils/SkillUtils'
import { JavascriptTypes, MethodExecuteArguments, SkillMethodGetText } from '../../utils/values/types'
import LastStepService from '../db/services/duel/LastStepService'
import UserClassService from '../db/services/user/UserClassService'
import DamageMethod from './DamageMethod'

export default class extends DamageMethod {
    args: JavascriptTypes[] = ['number']

    protected async _preCheck(options: MethodExecuteArguments<[number, number]>): Promise<boolean> {
        const {
            chatId,
            id
        } = options

        const duelId = await this._getDuelId(chatId, id)
        if (!duelId) return false

        const lastStep = await LastStepService.get(duelId)
        return !!(lastStep?.skill)
    }

    protected async _getRawDamage(options: MethodExecuteArguments<[number, number]>): Promise<number> {
        const {
            args: [precents],
            chatId,
            id
        } = options

        const duelId = await this._getDuelId(chatId, id)
        if(!duelId) return 0
        
        const lastStep = await LastStepService.get(duelId)
        if(!lastStep) return 0

        const {
            skill: skillName
        } = lastStep
        if(!skillName) return 0

        const type = await UserClassService.get(chatId, id)
        const skill = await SkillUtils.getSkillById(type, skillName)
        if(!skill) return 0

        return Math.floor(
            await SkillUtils.getTotalDamage({
                ...options,
                skill
            }) * precents
        )
    }

    async getText(options: MethodExecuteArguments<[number, number]> & SkillMethodGetText): Promise<string> {
        const {
            args: [precents]
        } = options

        return await FileUtils.readPugFromResource(
            'text/methods/return-damage.pug',
            {
                changeValues: {
                    precents
                }
            }
        )
    }

}