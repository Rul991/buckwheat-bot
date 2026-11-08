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

type CanOptions = {
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

        const availableSkills = skills
            .map(id => {
                return SkillRegistry.get(id)
            })
            .filter(v => v !== undefined)

        if(skills.length != availableSkills.length) {
            await this._repo.updateOne(
                {
                    chatId,
                    id
                },
                {
                    skills: availableSkills.map(v => v.id)
                }
            )
        }

        return availableSkills
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
                returnDocument: 'before'
            }
        )

        return Boolean(result && !result.skills.some(v => v == skill.id))
    }

    async remove({ chatId, id, skill }: SkillOptions): Promise<boolean> {
        const result = await this._repo.updateOne(
            { chatId, id },
            { $pull: { skills: skill.id } }
        )

        return Boolean(result?.skills.every(v => v != skill.id))
    }

    async canAdd({
        chatId,
        id,
        skill,
        level,
        className
    }: CanOptions) {
        const canAdd = characters[className].canUse(
            skill,
            level
        ) ?? true
        if(!canAdd) return false
        
        const skills = await this.get(chatId, id)
        return skills.skills.length < MAX_SELECTED_SKILLS_COUNT && !skills.skills.some(v => v == skill.id)
    }

    async canUse({
        chatId,
        id,
        skill,
        level,
        className
    }: CanOptions) {
        const canUse = characters[className].canUse(
            skill,
            level
        )
        if(canUse === undefined) return true
        if(!canUse) return false
        
        const skills = await this.get(chatId, id)
        return skills.skills.some(v => v == skill.id)
    }
}

export default new SelectedSkillsService()