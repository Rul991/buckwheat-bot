import FileUtils from '../../../utils/FileUtils'
import SkillUtils from '../../../utils/skills/SkillUtils'
import { MethodExecuteOptions, MethodGetTextOptions } from '../../../utils/values/types/skills'
import { JavascriptTypes } from '../../../utils/values/types/types'
import EffectService from '../../db/services/duel/EffectService'
import SkillMethod from './SkillMethod'

export default class extends SkillMethod<[string, string, number]> {
    args: JavascriptTypes[] = ['string', 'string', 'number']
    protected _has: boolean

    constructor (has: boolean) {
        super()
        this._has = has
    }

    protected async _preCheck({ duel }: MethodExecuteOptions<[string, string, number]>): Promise<boolean> {
        return Boolean(duel)
    }

    protected async _execute(options: MethodExecuteOptions<[string, string, number]>): Promise<boolean> {
        const {
            args: [needSkill, givenSkill, steps],
            duel,
            id,
            userId
        } = options
        if (!duel) return false
        const duelId = duel.id

        const hasEffect = await EffectService.userHas(
            duelId,
            id,
            needSkill
        )

        console.log({
            hasEffect,
            has: this._has,
            id,
            needSkill
        })

        if (this._has == hasEffect) {
            await EffectService.add(
                duelId,
                {
                    name: givenSkill,
                    remainingSteps: Math.ceil(steps),
                    sender: userId,
                    target: id
                }
            )
        }

        return true
    }

    protected async _getText(options: MethodGetTextOptions<[string, string, number]>): Promise<string> {
        const {
            args: [needSkillId, givenSkillId, steps]
        } = options

        const needSkill = SkillUtils.getSkillById(needSkillId)
        const givenSkill = SkillUtils.getSkillById(givenSkillId)
        const has = this._has

        return await FileUtils.readPugFromResource(
            'text/methods/effect-has.pug',
            {
                changeValues: {
                    needSkill,
                    givenSkill,
                    has,
                    steps
                }
            }
        )
    }
}