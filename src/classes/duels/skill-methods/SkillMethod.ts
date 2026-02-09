import SkillAttack from '../../../enums/SkillAttack'
import { SpecialEffectGetOptions } from '../../../utils/values/types/duels'
import { MethodExecuteOptions, MethodGetTextOptions } from '../../../utils/values/types/skills'
import { JavascriptTypes } from '../../../utils/values/types/types'
import ReverseSkillEffect from '../special-effects/ReverseSkillEffect'
import SkipSkillEffect from '../special-effects/SkipSkillEffect'
import ZeroSkillEffect from '../special-effects/ZeroSkillEffect'

export default abstract class <A extends any[]> {
    abstract args: JavascriptTypes[]
    protected abstract _preCheck({ }: MethodExecuteOptions<A>): Promise<boolean>
    protected abstract _execute({ }: MethodExecuteOptions<A>): Promise<boolean>
    protected abstract _getText({ }: MethodGetTextOptions<A>): Promise<string>

    protected _failBoost = 0
    protected _defaultBoost = 1
    protected _critBoost = 2

    validateArgs(skillArgs: A): skillArgs is A {
        for (let i = 0; i < this.args.length; i++) {
            const arg = this.args[i]
            const skillArg = typeof skillArgs[i]
            const isEqual = skillArg == arg

            if (!isEqual) {
                return false
            }
        }

        return true
    }

    getBoost(attack: SkillAttack) {
        if(attack == SkillAttack.Fail) {
            return this._failBoost
        }
        else if(attack == SkillAttack.Crit) {
            return this._critBoost
        }

        return this._defaultBoost
    }

    async execute(options: MethodExecuteOptions<A>): Promise<boolean> {
        if(!options.duel) return false

        const zeroSkillEffect = new ZeroSkillEffect({})
        const isZeroSkill = await zeroSkillEffect.get(
            options as SpecialEffectGetOptions
        )
        if(isZeroSkill) return true

        const reverseSkillEffect = new ReverseSkillEffect({
            methodOptions: options
        })
        await reverseSkillEffect.get(options as SpecialEffectGetOptions)

        return await this._execute(options)
    }

    async preCheck(options: MethodExecuteOptions<A>): Promise<boolean> {
        if(!options.duel) return false
        
        const skipSkillEffect = new SkipSkillEffect({})
        const isSkip = Boolean(
            await skipSkillEffect.get(options as SpecialEffectGetOptions)
        )

        if(isSkip) return false
        return await this._preCheck(options)
    }

    async getText(options: MethodGetTextOptions<A>): Promise<string> {
        return await this._getText(options)
    }
}