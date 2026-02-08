import FileUtils from '../../utils/FileUtils'
import { MethodExecuteOptions, MethodGetTextOptions } from '../../utils/values/types/skills'
import { JavascriptTypes } from '../../utils/values/types/types'
import EffectService from '../db/services/duel/EffectService'
import SkillMethod from './SkillMethod'

type Data = [boolean]

export default class extends SkillMethod<Data> {
    args: JavascriptTypes[] = ['boolean']

    protected async _preCheck({ duel }: MethodExecuteOptions<Data>): Promise<boolean> {
        return Boolean(duel)
    }

    protected async _execute({
        userId,
        enemyId,
        id,
        duel,
        args: [all]
    }: MethodExecuteOptions<Data>): Promise<boolean> {
        if (!duel) return false
        const duelId = duel.id

        if (all) {
            await EffectService.deleteAllByTarget(
                duelId,
                id
            )
        }
        else {
            await EffectService.deleteAllByTarget(
                duelId,
                userId
            )
            await EffectService.deleteAllByTarget(
                duelId,
                enemyId
            )
        }

        return true
    }

    protected async _getText({
        args: [all]
    }: MethodGetTextOptions<Data>): Promise<string> {
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