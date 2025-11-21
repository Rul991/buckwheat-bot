import FileUtils from '../../utils/FileUtils'
import SkillUtils from '../../utils/SkillUtils'
import { UNKNOWN_EFFECT } from '../../utils/values/consts'
import { JavascriptTypes, MethodExecuteArguments, SkillMethodGetText } from '../../utils/values/types'
import EffectService from '../db/services/duel/EffectService'
import SkillMethod from './SkillMethod'

export default class extends SkillMethod<[boolean]> {
    args: JavascriptTypes[] = ['boolean']

    protected async _preCheck(options: MethodExecuteArguments<[boolean]>): Promise<boolean> {
        const {
            chatId,
            id,
        } = options
        
        return !!(await this._getDuelId(chatId, id))
    }

    protected async _execute(options: MethodExecuteArguments<[boolean]>): Promise<boolean> {
        const {
            chatId,
            id,
            args: [all]
        } = options

        const duelId = await this._getDuelId(chatId, id)
        if(duelId === null) return false

        if(all) {
            await EffectService.set(duelId, [])
        }
        else {
            await EffectService.deleteAllByTarget(duelId, id)
        }
        
        return true
    }

    async getText(options: MethodExecuteArguments<[boolean]> & SkillMethodGetText): Promise<string> {
        const {
            args: [all]
        } = options

        return await FileUtils.readPugFromResource(
            'text/methods/delete-effects.pug',
            {
                changeValues: {
                    all
                }
            }
        )
    }

}