import { join } from "path/posix"
import type { MethodExecuteOptions, MethodGetDataOptions, MethodGetFailTextOptions, MethodGetSuccessTextOptions, MethodPreCheckOptions } from "../../../../types/skill-methods"
import { SkillAttack } from "../../../../protos/duels_pb"

export default abstract class SkillMethod {
    protected abstract _key: string
    protected abstract _getData(options: MethodGetDataOptions): Promise<number>
    protected abstract _precheck(options: MethodPreCheckOptions): Promise<boolean>
    protected abstract _execute(options: MethodExecuteOptions): Promise<void>

    protected _attackCoef = {
        fail: 0.5,
        normal: 1,
        crit: 1.5
    }

    async getData(options: Omit<MethodGetDataOptions, 'boost'>): Promise<number> {
        return await this._getData({
            ...options,
            boost: this.getBoost(options.attack)
        })
    }

    async precheck(options: MethodPreCheckOptions): Promise<boolean> {
        return await this._precheck(options)
    }

    async execute(options: MethodExecuteOptions): Promise<void> {
        return await this._execute(options)
    }

    getBoost(attack: SkillAttack): number {
        if(attack == SkillAttack.Fail) {
            return this._attackCoef.fail
        }
        else if(attack == SkillAttack.Crit) {
            return this._attackCoef.crit
        }

        return this._attackCoef.normal
    }

    getSuccessText(options: MethodGetSuccessTextOptions): string {
        const {
            ctx,
            data,
            showType
        } = options

        return ctx.t(
            join('skill-methods', 'success', this._key),
            {
                data,
                method: this,
                showType
            }
        )
    }

    getFailText(options: MethodGetFailTextOptions) {
        const {
            ctx
        } = options

        return ctx.t(
            join('skill-methods', 'fail', this._key),
            {
                method: this
            }
        )
    }

    get key(): string {
        return this._key
    }
}