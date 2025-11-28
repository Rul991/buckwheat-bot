import { REVERSE_SKILL_NAME, SKIP_SKILL_SKILL_NAME, ZERO_SKILL_SKILL_NAME } from '../../utils/values/consts'
import { JavascriptTypes, MethodExecuteArguments, AsyncOrSync, SkillMethodGetText } from '../../utils/values/types/types'
import DuelService from '../db/services/duel/DuelService'
import EffectService from '../db/services/duel/EffectService'

export default abstract class <A extends any[]> {
    abstract args: JavascriptTypes[]
    protected abstract _preCheck({ }: MethodExecuteArguments<A>): AsyncOrSync<boolean>
    protected abstract _execute({ }: MethodExecuteArguments<A>): AsyncOrSync<boolean>
    abstract getText({ }: MethodExecuteArguments<A> & SkillMethodGetText): AsyncOrSync<string>

    protected async _getDuelId(chatId: number, id: number) {
        const duel = await DuelService.getByUserId(chatId, id)
        if (!duel) return null

        return duel.id
    }

    protected async _reverseSkill(duelId: number, options: MethodExecuteArguments<A>) {
        const {
            id,
            userId,
            enemyId,
            skill: { isEffect }
        } = options

        if (isEffect) return
        if (!await EffectService.userHas(duelId, userId, REVERSE_SKILL_NAME)) return

        options.id = id == userId ? enemyId : userId
        options.enemyId = userId
        options.userId = enemyId
    }

    protected async _hasZeroSkill(duelId: number, id: number) {
        return await EffectService.userHas(duelId, id, ZERO_SKILL_SKILL_NAME)
    }

    async execute(options: MethodExecuteArguments<A>): Promise<boolean> {
        const {
            id,
            chatId
        } = options

        const duelId = await this._getDuelId(chatId, id)
        if (!duelId) return false

        if (await this._hasZeroSkill(duelId, id)) return true
        await this._reverseSkill(duelId, options)

        return await this._execute(options)
    }

    async preCheck(options: MethodExecuteArguments<A>): Promise<boolean> {
        const {
            chatId,
            id
        } = options

        const duelId = await this._getDuelId(chatId, id)
        if (!duelId) return false

        if (await EffectService.userHas(duelId, id, SKIP_SKILL_SKILL_NAME)) return false
        return await this._preCheck(options)
    }
}