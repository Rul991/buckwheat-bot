import { join } from "path/posix"
import type { MethodExecuteOptions, MethodGetDataOptions, MethodGetSuccessTextOptions, MethodPreCheckOptions } from "../../../../types/skill-methods"
import { SkillAttack } from "../../../../protos/duels_pb"
import type { GrullyI18nVars } from "@grully/i18n"

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
        if (attack == SkillAttack.Fail) {
            return this._attackCoef.fail
        }
        else if (attack == SkillAttack.Crit) {
            return this._attackCoef.crit
        }

        return this._attackCoef.normal
    }

    getSuccessTextVars(options: MethodGetSuccessTextOptions): GrullyI18nVars {
        const {
            data,
            showType,
            boost = 1
        } = options

        return {
            data,
            method: this,
            showType,
            boost
        }
    }

    getSuccessText(options: MethodGetSuccessTextOptions): string {
        const {
            ctx
        } = options

        return ctx.t(
            join('skill-methods', 'success', this._key),
            this.getSuccessTextVars(options)
        )
    }

    getFailText() {
        return join('skill-methods', 'fail', this._key)
    }

    get key(): string {
        return this._key
    }
}