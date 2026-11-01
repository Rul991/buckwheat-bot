import { MAX_SELECTED_SKILLS_COUNT } from "../../../consts/number"
import { characters } from "../../../resources/duels/characters/characters"
import type { ClassTypes } from "../../../types/class"
import type Skill from "../../../utils/duel/skill/Skill"
import SkillRegistry from "../../../utils/duel/skill/SkillRegistry"
import SelectedSkills from "../../entities/duel/SelectedSkills"
import BaseService from "../base/BaseService"

type SkillOptions = {
    chatId: number
    id: number
    skill: Skill
}

type IndexOptions = {
    chatId: number
    id: number
    index: number
}

type CanAddOptions = {
    className: ClassTypes
    level: number
    chatId: number
    id: number
    skill: Skill
}

class SelectedSkillsService extends BaseService<typeof SelectedSkills> {
    constructor() {
        super(SelectedSkills)
    }

    override async create(obj: SelectedSkills): Promise<SelectedSkills> {
        return await this._repo.getOrCreate(
            {
                chatId: obj.chatId,
                id: obj.id
            },
            obj
        )
    }

    async get(chatId: number, id: number) {
        return await this.create(
            new SelectedSkills({
                chatId,
                id
            })
        )
    }

    async getSkills(chatId: number, id: number) {
        const selectedSkills = await this.get(chatId, id)
        const skills = selectedSkills.skills

        return skills
            .map(id => {
                return SkillRegistry.get(id)
            })
            .filter(v => v !== undefined)
    }

    async add({
        chatId,
        id,
        skill
    }: SkillOptions): Promise<boolean> {
        const result = await this._repo.updateOne(
            {
                chatId,
                id
            },
            [
                {
                    $set: {
                        skills: {
                            $let: {
                                vars: { cur: { $ifNull: ["$skills", []] } },
                                in: {
                                    $cond: [
                                        {
                                            $or: [
                                                { $in: [skill.id, "$$cur"] },
                                                { $gte: [{ $size: "$$cur" }, MAX_SELECTED_SKILLS_COUNT] }
                                            ]
                                        },
                                        "$$cur",
                                        { $concatArrays: ["$$cur", [skill.id]] }
                                    ]
                                }
                            }
                        }
                    }
                }
            ],
            {
                upsert: true,
            }
        )

        return (result && result.skills.find(v => v == skill.id)) !== undefined
    }

    async remove({ chatId, id, skill }: SkillOptions): Promise<boolean> {
        const result = await this._repo.updateOne(
            { chatId, id },
            { $pull: { skills: skill.id } }
        )

        return Boolean(result?.skills.every(v => v != skill.id))
    }

    async removeByIndex({ chatId, id, index }: IndexOptions): Promise<boolean> {
        if (!Number.isInteger(index) || index < 0 || index >= MAX_SELECTED_SKILLS_COUNT) return false

        const result = await this._repo.updateOne(
            { chatId, id },
            [
                {
                    $set: {
                        skills: {
                            $let: {
                                vars: { cur: { $ifNull: ["$skills", []] } },
                                in: {
                                    $cond: [
                                        { $lt: [index, { $size: "$$cur" }] },
                                        {
                                            $concatArrays: [
                                                { $slice: ["$$cur", 0, index] },
                                                { $slice: ["$$cur", { $add: [index, 1] }, { $size: "$$cur" }] }
                                            ]
                                        },
                                        "$$cur"
                                    ]
                                }
                            }
                        }
                    }
                }
            ]
        )

        return Boolean(result)
    }

    async canAdd({
        chatId,
        id,
        skill,
        level,
        className
    }: CanAddOptions) {
        const canAdd = characters[className].canAdd(
            skill,
            level
        )
        if(!canAdd) return false
        
        const skills = await this.get(chatId, id)
        return skills.skills.length < MAX_SELECTED_SKILLS_COUNT && !skills.skills.find(v => v == skill.id)
    }
}

export default new SelectedSkillsService()