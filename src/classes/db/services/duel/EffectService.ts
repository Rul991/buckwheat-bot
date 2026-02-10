import Effect from '../../../../interfaces/schemas/duels/Effect'
import SkillUtils from '../../../../utils/skills/SkillUtils'
import SkillAttack from '../../../../enums/SkillAttack'
import { AsyncOrSync, DeleteEffectsByNameTargetStepsOptions } from '../../../../utils/values/types/types'
import { CallbackButtonContext } from '../../../../utils/values/types/contexts'
import Duel from '../../../../interfaces/schemas/duels/Duel'
import DuelStepService from './DuelStepService'
import EffectUtils from '../../../../utils/skills/EffectUtils'
import Logging from '../../../../utils/Logging'

export default class {
    static async get(duelId: number): Promise<Effect[]> {
        return (await DuelStepService.getCurrent(duelId))?.effects ?? []
    }

    private static async _update(duelId: number, callback: (effects: Effect[]) => AsyncOrSync<Effect[]>) {
        const effects = await this.get(duelId)
        const newEffects = await callback(Array.from(effects))

        Logging.log({
            effects,
            newEffects
        })

        await this.set(
            duelId,
            newEffects
        )
    }

    static async add(duelId: number, ...effects: Effect[]) {
        return await this._update(
            duelId,
            currentEffects => {
                return EffectUtils.add(currentEffects, effects)
            }
        )
    }

    static async deleteByName(duelId: number, name: string) {
        return await this._update(
            duelId,
            effects => {
                return EffectUtils.deleteByName(effects, name)
            }
        )
    }

    static async deleteByNameAndTarget(duelId: number, name: string, target: number) {
        return await this._update(
            duelId,
            effects => {
                return EffectUtils.deleteByNameAndTarget(effects, name, target)
            }
        )
    }

    static async deleteByNameTargetSteps({
        duelId,
        steps,
        name,
        target,
        isEvery = true
    }: DeleteEffectsByNameTargetStepsOptions) {
        await this._update(
            duelId,
            effects => {
                for (const effect of effects) {
                    if (steps <= 0) break

                    if (effect.name == name && effect.target == target) {
                        const minusSteps = Math.min(steps, effect.remainingSteps)
                        steps -= minusSteps
                        effect.remainingSteps -= minusSteps
                    }

                    if (!isEvery) break
                }

                console.log({
                    steps,
                    effects
                })
                return effects.filter(v => v.remainingSteps > 0)
            }
        )

        return steps
    }

    static async deleteAllByName(duelId: number, name: string) {
        return await this._update(
            duelId,
            effects => {
                return effects.filter(v => v.name != name)
            }
        )
    }

    static async deleteAllByTarget(duelId: number, target: number) {
        return await this._update(
            duelId,
            effects => {
                return effects.filter(v => v.target != target)
            }
        )
    }

    static async deleteAllByNameTarget(duelId: number, name: string, target: number) {
        return await this._update(
            duelId,
            effects => {
                return effects.filter(v => v.name != name && v.target == target)
            }
        )
    }

    static async has(duelId: number, name: string) {
        const effects = await this.get(duelId)

        return effects.some(v => v.name == name)
    }

    static async userHas(duelId: number, userId: number, name: string) {
        const effects = await this.get(duelId)

        return effects.some(v => v.name == name && v.target == userId)
    }

    static async getTotalSteps(duelId: number, name: string) {
        const effects = await this.get(duelId)

        return effects.reduce((prev, curr) => {
            return (curr.name == name ? curr.remainingSteps : 0) + prev
        }, 0)
    }

    static async getByTarget(duelId: number, id: number) {
        const effects = await this.get(duelId)
        return effects.filter(v => v.target == id)
    }

    static async getByName(duelId: number, name: string) {
        const effects = await this.get(duelId)
        return effects.filter(v => v.name == name)
    }

    static async set(duelId: number, effects: Effect[]) {
        return await DuelStepService.updateCurrent(
            duelId,
            {
                effects
            }
        )
    }

    static async use(ctx: CallbackButtonContext, duel: Duel, effects?: Effect[]) {
        const { chatId, id } = duel
        const currentEffects = (effects ?? await this.get(id))
            .map(({
                name,
                remainingSteps,
                target,
                sender
            }) => ({
                remainingSteps: remainingSteps - 1,
                name,
                target,
                sender
            }))

        await this.set(
            id,
            currentEffects
        )

        for (const { name, sender, target } of currentEffects) {
            const skill = SkillUtils.getSkillById(name)

            await SkillUtils.useSkill({
                ctx,
                attack: SkillAttack.Normal,
                userId: sender,
                enemyId: target,
                skill,
                chatId,
                duel,
                isEffect: true
            })
        }

        const newEffects = (await this.get(id))
            .filter(v => v.remainingSteps > 0)

        await this.set(
            id,
            newEffects
        )
    }
}