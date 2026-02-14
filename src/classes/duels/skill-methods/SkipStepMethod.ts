import DuelUtils from '../../../utils/duel/DuelUtils'
import FileUtils from '../../../utils/FileUtils'
import { MethodExecuteOptions, MethodGetTextOptions } from '../../../utils/values/types/skills'
import { JavascriptTypes } from '../../../utils/values/types/types'
import DuelService from '../../db/services/duel/DuelService'
import SkillMethod from './SkillMethod'

export default class extends SkillMethod<[]> {
    args: JavascriptTypes[] = []

    protected async _preCheck({ duel }: MethodExecuteOptions<[]>): Promise<boolean> {
        return Boolean(duel)
    }

    protected async _execute({
        duel,
        id
    }: MethodExecuteOptions<[]>): Promise<boolean> {
        if (!duel) return false

        const duelId = duel.id
        return await DuelService.skipStep(
            duelId,
            DuelUtils.getEnemy(duel, id)
        )
    }

    protected async _getText({ }: MethodGetTextOptions<[]>): Promise<string> {
        return await FileUtils.readPugFromResource(
            'text/methods/skip-step.pug'
        )
    }
}