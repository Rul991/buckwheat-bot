import type Skill from "./Skill"

export default class SkillRegistry {
    private static _skills: Map<number, Skill> = new Map()

    static setup(...skills: Skill[]): void {
        for (const skill of skills) {
            this._skills.set(
                skill.id,
                skill
            )
        }
    }

    static get(id: number): Skill | undefined {
        return this._skills.get(id)
    }
}