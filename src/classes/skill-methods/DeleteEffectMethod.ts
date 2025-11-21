import FileUtils from '../../utils/FileUtils'
import SkillUtils from '../../utils/SkillUtils'
import { UNKNOWN_EFFECT } from '../../utils/values/consts'
import { JavascriptTypes, MethodExecuteArguments, SkillMethodGetText } from '../../utils/values/types'
import EffectService from '../db/services/duel/EffectService'
import SkillMethod from './SkillMethod'

export default class extends SkillMethod<[string, boolean]> {
    args: JavascriptTypes[] = ['string', 'boolean']

    protected async _preCheck(options: MethodExecuteArguments<[string, boolean]>): Promise<boolean> {
        const {
            chatId,
            id,
        } = options
        
        return !!(await this._getDuelId(chatId, id))
    }

    protected async _execute(options: MethodExecuteArguments<[string, boolean]>): Promise<boolean> {
        const {
            chatId,
            id,
            args: [skillId, all]
        } = options

        const duelId = await this._getDuelId(chatId, id)
        if(duelId === null) return false

        if(all) {
            await EffectService.deleteAllByNameTarget(duelId, skillId, id)
        }
        else {
            await EffectService.deleteByNameAndTarget(duelId, skillId, id)
        }
        
        return true
    }

    protected async _getSkill(options: MethodExecuteArguments<[string, boolean]>) {
        const {
            chatId,
            id,
            args: [skillId]
        } = options
        const skill = await SkillUtils.getUserSkillById(chatId, id, skillId)
        return skill
    }

    async getText(options: MethodExecuteArguments<[string, boolean]> & SkillMethodGetText): Promise<string> {
        const {
            args: [_, all]
        } = options
        const title = (await this._getSkill(options))?.title ?? UNKNOWN_EFFECT

        return await FileUtils.readPugFromResource(
            'text/methods/delete-effect.pug',
            {
                changeValues: {
                    title,
                    all
                }
            }
        )
    }

}