import FileUtils from '../../utils/FileUtils'
import SkillUtils from '../../utils/skills/SkillUtils'
import { MethodExecuteOptions, MethodGetTextOptions } from '../../utils/values/types/skills'
import { JavascriptTypes } from '../../utils/values/types/types'
import EffectService from '../db/services/duel/EffectService'
import SkillMethod from './SkillMethod'

export default class <T extends any[] = [string, number]> extends SkillMethod<T> {
    args: JavascriptTypes[] = ['string', 'number']

    protected async _preCheck({ }: MethodExecuteOptions<T>): Promise<boolean> {
        return true
    }

    protected _getSteps(steps: number, boost: number) {
        return boost * steps
    }

    protected async _execute({
        args: [skillId, steps],
        duel,
        boost,
        userId,
        id
    }: MethodExecuteOptions<T>): Promise<boolean> {
        if(!duel) return false
        const duelId = duel.id

        await EffectService.add(
            duelId,
            {
                name: skillId,
                remainingSteps: this._getSteps(steps, boost),
                sender: userId,
                target: id
            }
        )
        return true
    }

    protected _getText({
        args: [skillId, rawSteps],
        boost
    }: MethodGetTextOptions<T>): Promise<string> {
        const skill = SkillUtils.getSkillById(skillId)
        const title = skill.info.title
        const steps = this._getSteps(rawSteps, boost)

        return FileUtils.readPugFromResource(
            'text/methods/effect.pug',
            {
                changeValues: {
                    steps,
                    title
                }
            }
        )
    }

}