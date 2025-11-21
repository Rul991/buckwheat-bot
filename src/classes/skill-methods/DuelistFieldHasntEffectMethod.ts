import FileUtils from '../../utils/FileUtils'
import { JavascriptTypes, MethodExecuteArguments, SkillMethodGetText } from '../../utils/values/types'
import DuelService from '../db/services/duel/DuelService'
import EffectService from '../db/services/duel/EffectService'
import DuelistFieldAddMethod from './DuelistFieldAddMethod'
import SkillMethodUtils from '../../utils/SkillMethodTextsUtils'
import UserClassService from '../db/services/user/UserClassService'
import SkillUtils from '../../utils/SkillUtils'

export default class extends DuelistFieldAddMethod<[number, string]> {
    args: JavascriptTypes[] = ['number', 'string']
    protected async _isAdd(options: MethodExecuteArguments<[number, string]>): Promise<boolean> {
        const {
            chatId,
            id,
            args: [_value, name]
        } = options

        const duel = await DuelService.getByUserId(chatId, id)
        if(!duel) return false
        const duelId = duel.id

        return await EffectService.userHas(duelId, id, name)
    }

    async getText(options: MethodExecuteArguments<[number, string]> & SkillMethodGetText): Promise<string> {
        const {
            args: [_, name],
            chatId,
            id
        } = options

        const type = await UserClassService.get(chatId, id)
        const value = await this._getValue(options)

        return await SkillMethodUtils.getAddCharHasntEffectMessage(
            value,
            this._symbol,
            name,
            type,
        )
    }
}