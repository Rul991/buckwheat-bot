import FileUtils from '../../../utils/FileUtils'
import { SpecialEffectGetOptions } from '../../../utils/values/types/duels'
import { MethodExecuteOptions, MethodGetTextOptions } from '../../../utils/values/types/skills'
import { JavascriptTypes } from '../../../utils/values/types/types'
import DuelistService from '../../db/services/duelist/DuelistService'
import CloneEffect from '../special-effects/CloneEffect'
import DamageUpEffect from '../special-effects/DamageUpEffect'
import DefendEffect from '../special-effects/DefendEffect'
import InvulnerableEffect from '../special-effects/InvulnerableEffect'
import SkipDamageEffect from '../special-effects/SkipDamageEffect'
import SkillMethod from './SkillMethod'

type Data = [number, number]

export default class extends SkillMethod<Data> {
    args: JavascriptTypes[] = ['number']
    protected _filename: string = 'damage'

    protected async _getRawDamage({
        args: [damage]
    }: MethodExecuteOptions<Data>) {
        return damage
    }

    protected async _isSkipDamage(options: MethodExecuteOptions<Data>, isText: boolean) {
        const effects = [
            new InvulnerableEffect({}),
            new SkipDamageEffect({
                isText
            })
        ]

        for (const effect of effects) {
            if(await effect.get(options as SpecialEffectGetOptions)) {
                return true
            }
        }

        return false
    }

    protected async _getDamageAfterDefend(damage: number, options: MethodExecuteOptions<Data>): Promise<number> {
        const {
            duel,
            id,
            skill,
            chatId
        } = options
        if(!duel) return 0

        const effect = new DefendEffect({ damage, })
        return await effect.get({
            duel,
            id,
            skill,
            chatId
        })
    }

    protected async _getDamageAfterClone(damage: number, options: MethodExecuteOptions<Data>): Promise<number> {
        if(!options.duel) return 0
        const {
            duel,
            id,
            skill,
            chatId
        } = options

        const effect = new CloneEffect({ damage, })
        return await effect.get({
            duel,
            id,
            skill,
            chatId
        })
    }

    protected async _getDamageUpBoost(options: MethodExecuteOptions<Data>) {
        const damageUpEffect = new DamageUpEffect({})
        return await damageUpEffect.get(options as SpecialEffectGetOptions)
    }

    protected async _getRemainingDamage(damage: number, options: MethodExecuteOptions<Data>): Promise<number> {
        const afterCloneDamage = await this._getDamageAfterClone(damage, options)
        const afterDefendDamage = await this._getDamageAfterDefend(afterCloneDamage, options)

        return afterDefendDamage
    }

    protected async _getDamage(options: MethodExecuteOptions<Data>, isText: boolean) {
        const {
            boost
        } = options

        const isSkip = await this._isSkipDamage(options, isText)
        if(isSkip) return 0

        const rawDamage = await this._getRawDamage(options)
        const effectBoost = await this._getDamageUpBoost(options)
        const damage = rawDamage * boost * (effectBoost + 1)

        return Math.ceil(damage)
    }

    protected async _preCheck({ }: MethodExecuteOptions<Data>): Promise<boolean> {
        return true
    }

    protected async _execute(options: MethodExecuteOptions<Data>): Promise<boolean> {
        const {
            id,
            chatId
        } = options

        const damage = await this._getDamage(options, false)
        if (damage <= 0) return true

        const remainingDamage = await this._getRemainingDamage(
            damage,
            options
        )

        await DuelistService.addField(
            chatId,
            id,
            'hp',
            -remainingDamage
        )

        return true
    }

    protected async _getText(options: MethodGetTextOptions<Data>): Promise<string> {
        const {
            args
        } = options
        const damage = await this._getDamage(options, true)
        return await FileUtils.readPugFromResource(
            `text/methods/${this._filename}.pug`,
            {
                changeValues: {
                    damage,
                    args
                }
            }
        )
    }
}