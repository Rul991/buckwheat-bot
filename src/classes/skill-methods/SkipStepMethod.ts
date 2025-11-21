import DuelUtils from '../../utils/DuelUtils'
import FileUtils from '../../utils/FileUtils'
import { JavascriptTypes, MethodExecuteArguments, AsyncOrSync, SkillMethodGetText } from '../../utils/values/types'
import DuelService from '../db/services/duel/DuelService'
import SkillMethod from './SkillMethod'

export default class extends SkillMethod<[]> {
    args: JavascriptTypes[] = []

    protected async _preCheck({ }: MethodExecuteArguments<[]>): Promise<boolean> {
        return true
    }

    protected async _execute({ chatId, id }: MethodExecuteArguments<[]>): Promise<boolean> {
        const duel = await DuelService.getByUserId(chatId, id)
        if(!duel) return false

        const duelId = duel.id
        const enemyId = DuelUtils.getEnemy(duel, id)
        await DuelService.changeDuelist(duelId, enemyId)

        return true
    }

    async getText({
        skill: { onEnemy }
    }: MethodExecuteArguments<[]> & SkillMethodGetText): Promise<string> {
        return await FileUtils.readPugFromResource(
            'text/methods/skip-step.pug',
            {
                changeValues: {
                    onEnemy
                }
            }
        )
    }
}