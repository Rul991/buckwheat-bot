import { join } from "path/posix"
import type { MethodExecuteOptions, MethodGetDataOptions, MethodGetTextOptions, MethodPreCheckOptions } from "../../types/duels"
import { SkillAttack } from "../../protos/duels_pb"

export default abstract class SkillMethod {
    protected abstract _key: string
    protected abstract _getData(options: MethodGetDataOptions): Promise<number>
    protected abstract _precheck(options: MethodPreCheckOptions): Promise<boolean>
    protected abstract _execute(options: MethodExecuteOptions): Promise<void>

    protected _attackCoef = {
        fail: 0.25,
        normal: 1,
        crit: 2
    }

    async getData(options: MethodGetDataOptions): Promise<number> {
        return await this._getData(options)
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

    getText(options: MethodGetTextOptions): string {
        const {
            ctx,
            data,
        } = options

        return ctx.t(
            join('skill-methods', this._key),
            {
                data,
                method: this
            }
        )
    }
}