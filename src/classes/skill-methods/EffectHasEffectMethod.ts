import ReplaceOptions from '../../interfaces/options/ReplaceOptions'
import SkillUtils from '../../utils/SkillUtils'
import { UNKNOWN_EFFECT } from '../../utils/values/consts'
import { JavascriptTypes, MethodExecuteArguments } from '../../utils/values/types/types'
import DuelService from '../db/services/duel/DuelService'
import EffectService from '../db/services/duel/EffectService'
import UserClassService from '../db/services/user/UserClassService'
import EffectMethod from './EffectMethod'

export default class extends EffectMethod<[string, string, number]> {
    args: JavascriptTypes[] = ['string', 'string', 'number']
    protected _filename: string = 'effect-has'
    protected _hasOrHasnt: boolean

    constructor(hasOrHasnt: boolean) {
        super()
        this._hasOrHasnt = hasOrHasnt
    }

    protected async _getChangeValues(options: MethodExecuteArguments<[string, string, number]>): Promise<ReplaceOptions['changeValues']> {
        const {
            chatId,
            userId,
            args: [needName]
        } = options

        const type = await UserClassService.get(chatId, userId)
        const skill = await SkillUtils.getSkillById(type, needName)
        const title = skill?.title ?? UNKNOWN_EFFECT

        return {
            ...await super._getChangeValues(options),
            has: this._hasOrHasnt,
            needSkill: title
        }
    }

    protected async _getRawSteps({ args: [_name, _, steps] }: MethodExecuteArguments<[string, string, number]>): Promise<number> {
        return steps
    }

    protected async _getSkillName({args: [_, name]}: MethodExecuteArguments<[string, string, number]>): Promise<string> {
        return name
    }

    protected async _condition(options: MethodExecuteArguments<[string, string, number]>): Promise<boolean> {
        const {
            chatId,
            id,
            args: [needSkill]
        } = options

        const duel = await DuelService.getByUserId(chatId, id)
        if(!duel) return false
        const duelId = duel.id

        return await EffectService.userHas(duelId, id, needSkill)
    }
}