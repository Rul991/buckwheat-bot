import FileUtils from '../../../utils/FileUtils'
import SkillUtils from '../../../utils/skills/SkillUtils'
import { MethodExecuteOptions, MethodGetTextOptions } from '../../../utils/values/types/skills'
import { JavascriptTypes } from '../../../utils/values/types/types'
import EffectService from '../../db/services/duel/EffectService'
import SkillMethod from './SkillMethod'

export default class <T extends any[] = [string, number]> extends SkillMethod<T> {
    args: JavascriptTypes[] = ['string', 'number']

    protected async _preCheck({ duel }: MethodExecuteOptions<T>): Promise<boolean> {
        return Boolean(duel)
    }

    protected async _getRawSteps(options: MethodExecuteOptions<T>) {
        const {
            args: [_, steps]
        } = options

        return steps as number
    }

    protected async _getSteps(options: MethodExecuteOptions<T>) {
        const {
            boost
        } = options
        const steps = await this._getRawSteps(options)
        return boost * steps
    }

    protected async _execute(options: MethodExecuteOptions<T>): Promise<boolean> {
        const {
            args: [skillId],
            duel,
            userId,
            id
        } = options
        if (!duel) return false
        const duelId = duel.id

        await EffectService.add(
            duelId,
            {
                name: skillId,
                remainingSteps: await this._getSteps(options),
                sender: userId,
                target: id
            }
        )
        return true
    }

    protected async _getText(options: MethodGetTextOptions<T>): Promise<string> {
        const {
            args: [skillId]
        } = options
        const skill = SkillUtils.getSkillById(skillId)
        const title = skill.info.title
        const steps = await this._getSteps(options)

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