import FileUtils from '../../utils/FileUtils'
import SkillUtils from '../../utils/skills/SkillUtils'
import { MethodExecuteOptions, MethodGetTextOptions } from '../../utils/values/types/skills'
import { JavascriptTypes } from '../../utils/values/types/types'
import EffectService from '../db/services/duel/EffectService'
import SkillMethod from './SkillMethod'

type Data = [string, boolean]

export default class extends SkillMethod<Data> {
    args: JavascriptTypes[] = ['string', 'boolean']

    protected async _preCheck({ duel }: MethodExecuteOptions<Data>): Promise<boolean> {
        return Boolean(duel)
    }

    protected async _execute({
        id,
        args: [skillId, all],
        duel
    }: MethodExecuteOptions<Data>): Promise<boolean> {
        if (!duel) return false
        const duelId = duel.id

        if (all) {
            await EffectService.deleteAllByNameTarget(
                duelId,
                skillId,
                id
            )
        }
        else {
            await EffectService.deleteByNameAndTarget(
                duelId,
                skillId,
                id
            )
        }

        return true
    }

    protected async _getText({
        args: [skillId, all]
    }: MethodGetTextOptions<Data>): Promise<string> {
        const skill = SkillUtils.getSkillById(skillId)
        const title = skill.info.title

        return await FileUtils.readPugFromResource(
            'text/methods/delete-effect.pug',
            {
                changeValues: {
                    all,
                    title
                }
            }
        )
    }
}