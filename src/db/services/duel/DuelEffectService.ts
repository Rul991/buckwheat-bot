import type Skill from "../../../utils/duel/skill/Skill"
import SkillRegistry from "../../../utils/duel/skill/SkillRegistry"
import DuelEffect from "../../entities/duel/DuelEffect"
import BaseService from "../base/BaseService"

type DuelistEffect = {
    steps: number
    skill: Skill
}

type AddOptions = {
    chatId: number
    caster: number
    target: number
    steps: number
    skill: Skill
}
type HasOptions =
    & Omit<AddOptions, 'steps'>

class DuelEffectService extends BaseService<typeof DuelEffect> {
    constructor() {
        super(DuelEffect)
    }

    async getDuelistsEffects(chatId: number): Promise<Map<number, DuelistEffect[]>> {
        const result = new Map<number, DuelistEffect[]>()
        const effects = await this._repo.find({ chatId })

        for (const effect of effects) {
            const skill = SkillRegistry.get(effect.skillId)
            if (!skill) continue

            const arr = result.getOrInsert(
                effect.target,
                []
            )

            arr.push({
                skill,
                steps: effect.steps
            })
        }

        return result
    }

    async deleteByChatId(chatId: number) {
        return await this.deleteMany({ chatId })
    }

    async getAllByChatId(chatId: number) {
        return await this._repo.find({ chatId, steps: { $gt: 0 } })
    }

    async step(chatId: number) {
        const result = await this._repo.updateMany(
            { chatId, steps: { $gt: 0 } },
            {
                $inc: {
                    steps: -1
                }
            }
        )

        return result.matchedCount > 0
    }

    async add(options: AddOptions) {
        const {
            chatId,
            target,
            caster,
            skill,
            steps
        } = options

        const result = await this._repo.updateOne(
            {
                chatId,
                caster,
                target,
                skillId: skill.id
            },
            {
                $inc: steps
            },
            {
                upsert: true
            }
        )

        return result
    }

    async getEffectSteps(options: HasOptions) {
        const {
            chatId,
            target,
            caster,
            skill,
        } = options

        const result = await this._repo.findOne(
            {
                chatId,
                caster,
                target,
                skillId: skill.id
            }
        )

        return result?.steps ?? 0
    }
}

export default new DuelEffectService()