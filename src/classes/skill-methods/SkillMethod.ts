import SkillAttack from '../../enums/SkillAttack'
import { MethodExecuteOptions, MethodGetTextOptions } from '../../utils/values/types/skills'
import { JavascriptTypes } from '../../utils/values/types/types'

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
        return await this._execute(options)
    }

    async preCheck(options: MethodExecuteOptions<A>): Promise<boolean> {
        return await this._preCheck(options)
    }

    async getText(options: MethodGetTextOptions<A>): Promise<string> {
        return await this._getText(options)
    }
}