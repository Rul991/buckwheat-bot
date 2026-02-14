import FileUtils from '../../../utils/FileUtils'
import SkillUtils from '../../../utils/skills/SkillUtils'
import { EFFECT_LAST_STEP } from '../../../utils/values/consts'
import { MethodExecuteOptions, MethodGetTextOptions } from '../../../utils/values/types/skills'
import { JavascriptTypes } from '../../../utils/values/types/types'
import EffectService from '../../db/services/duel/EffectService'
import SkillMethod from './SkillMethod'

export default class extends SkillMethod<[string, string, number]> {
    args: JavascriptTypes[] = ['string', 'string', 'number']

    protected async _preCheck({ duel }: MethodExecuteOptions<[string, string, number]>): Promise<boolean> {
        return Boolean(duel)
    }

    protected async _execute({
        duel,
        id,
        args: [needSkillId, givenSkillId, steps],
        boost,
        userId
    }: MethodExecuteOptions<[string, string, number]>): Promise<boolean> {
        if(!duel) return false
        const duelId = duel.id
        const effects = await EffectService.getByTarget(
            duelId,
            id
        )

        const hasLastStepEffect = effects.some((effect) => {
            return (
                effect.remainingSteps == EFFECT_LAST_STEP &&
                effect.name == needSkillId
            )
        })

        if(hasLastStepEffect) {
            await EffectService.add(
                duelId,
                {
                    name: givenSkillId,
                    remainingSteps: Math.ceil(steps * boost),
                    sender: userId,
                    target: id
                }
            )
        }

        return true
    }

    protected async _getText({
        args: [needSkillId, givenSkillId, steps]
    }: MethodGetTextOptions<[string, string, number]>): Promise<string> {
        const needSkill = SkillUtils.getSkillById(needSkillId)
        const givenSkill = SkillUtils.getSkillById(givenSkillId)

        return await FileUtils.readPugFromResource(
            'text/methods/effect-last-step.pug',
            {
                changeValues: {
                    steps,
                    needSkill,
                    givenSkill
                }
            }
        )
    }
}