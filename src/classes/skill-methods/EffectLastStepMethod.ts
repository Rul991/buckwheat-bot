import ReplaceOptions from '../../interfaces/options/ReplaceOptions'
import SkillUtils from '../../utils/SkillUtils'
import { UNKNOWN_EFFECT } from '../../utils/values/consts'
import { MethodExecuteArguments } from '../../utils/values/types/types'
import DuelService from '../db/services/duel/DuelService'
import EffectService from '../db/services/duel/EffectService'
import UserClassService from '../db/services/user/UserClassService'
import EffectMethod from './EffectMethod'

export default class extends EffectMethod<[string, string, number]> {
    protected _filename: string = 'effect-last-step'

    protected async _condition({
        chatId,
        id,
        args: [needEffect]
    }: MethodExecuteArguments<[string, string, number]>): Promise<boolean> {
        const duel = await DuelService.getByUserId(chatId, id)
        if(!duel) return false
        const duelId = duel.id

        const effects = await EffectService.getByTarget(duelId, id)
        return effects.some(({name, remainingSteps}) => {
            return name == needEffect && remainingSteps == 0
        })
    }

    protected async _getRawSteps({ args: [_needName, _giveName, steps] }: MethodExecuteArguments<[string, string, number]>): Promise<number> {
        return steps
    }

    protected async _getSkillName({ args: [_needName, givenName] }: MethodExecuteArguments<[string, string, number]>): Promise<string> {
        return givenName
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
            needSkill: title
        }
    }
}