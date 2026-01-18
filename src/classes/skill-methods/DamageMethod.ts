import SkillAttack from '../../enums/SkillAttack'
import FileUtils from '../../utils/FileUtils'
import { CLONE_SKILL_NAME, DAMAGE_UP_SKILL_NAME, DEFEND_SKILL_NAME, INVULNERABLE_SKILL_NAME, SKIP_DAMAGE_SKILL_NAME } from '../../utils/values/consts'
import { JavascriptTypes, MethodExecuteArguments, SkillMethodGetText } from '../../utils/values/types/types'
import DuelService from '../db/services/duel/DuelService'
import EffectService from '../db/services/duel/EffectService'
import DuelistService from '../db/services/duelist/DuelistService'
import SkillMethod from './SkillMethod'

type Options = MethodExecuteArguments<[number, number]> & {isText: boolean}

type RemainingDamageOptions = {
    duelId: number
    target: number
    damage: number
}

export default class extends SkillMethod<[number, number]> {
    args: JavascriptTypes[] = ['number']

    protected async _preCheck({ }: MethodExecuteArguments<[number, number]>): Promise<boolean> {
        return true
    }

    protected async _getRawDamage({
        args: [argDamage],
    }: MethodExecuteArguments<[number, number]>) {
        return argDamage
    }

    protected async _getBoostFromDamageEffects(duelId: number, userId: number) {
        const effects = await EffectService.getByTarget(duelId, userId)
        return effects.reduce((prev, { name }) => {
            if (name.startsWith(DAMAGE_UP_SKILL_NAME)) {
                const start = DAMAGE_UP_SKILL_NAME.length - 1
                const rawProcents = name.slice(start)
                const procents = rawProcents && !isNaN(+rawProcents) ? +rawProcents : 0

                return prev + procents
            }
            return prev
        }, 0) / 100
    }

    protected async _getBoostFromEffects(options: Options) {
        const { chatId, userId, id, isText } = options

        const duel = await DuelService.getByUserId(chatId, userId)
        if (!duel) return 0
        const duelId = duel.id

        if (await EffectService.userHas(duelId, id, INVULNERABLE_SKILL_NAME)) return -1
        if (await EffectService.userHas(duelId, id, SKIP_DAMAGE_SKILL_NAME)) {
            if(!isText) {
                await EffectService.deleteByNameAndTarget(duelId, SKIP_DAMAGE_SKILL_NAME, id)
            }
            return -1
        }

        return this._getBoostFromDamageEffects(duelId, userId)
    }

    async getDamage(options: Options) {
        const {
            attack,
        } = options

        const damage = Math.round(await this._getRawDamage(options) * this._getBoost(attack))
        return Math.max(
            damage * (1 + await this._getBoostFromEffects(options)),
            0
        )
    }

    protected _getBoost(attack: SkillAttack) {
        switch (attack) {
            case SkillAttack.Crit:
                return 1.5

            case SkillAttack.Fail:
                return 0.5

            default:
                return 1
        }
    }

    protected async _getRemainingDamage({
        duelId,
        target,
        damage
    }: RemainingDamageOptions): Promise<number> {
        const cloneRemainingDamage = await EffectService.deleteByNameTargetSteps(
            {
                duelId,
                name: CLONE_SKILL_NAME,
                steps: damage,
                target,
                isEvery: false
            }
        )

        if(cloneRemainingDamage < damage) {
            return 0
        }

        return await EffectService.deleteByNameTargetSteps(
            {
                duelId,
                name: DEFEND_SKILL_NAME,
                steps: damage,
                target
            }
        )
    }

    async _execute(options: MethodExecuteArguments<[number, number]>): Promise<boolean> {
        const {
            id,
            chatId,
        } = options

        const duel = await DuelService.getByUserId(chatId, id)
        if (!duel) return false
        const duelId = duel.id

        const damage = await this.getDamage({...options, isText: false})
        const remainingDamage = await this._getRemainingDamage({
            duelId,
            target: id,
            damage
        })

        await DuelistService.addField(chatId, id, 'hp', -remainingDamage)
        return true
    }

    async getText(options: MethodExecuteArguments<[number, number]> & SkillMethodGetText): Promise<string> {
        const {
            skill: { onEnemy }
        } = options

        const damage = await this.getDamage({...options, isText: true})
        return await FileUtils.readPugFromResource(
            'text/methods/damage.pug',
            {
                changeValues: {
                    onEnemy,
                    damage
                }
            }
        )
    }
}