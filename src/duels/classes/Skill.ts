import { join } from "path/posix"
import type { BotContext } from "../../types/bot"
import type SkillMethod from "../methods/SkillMethod"

type SkillConstructorOptions =
    & Pick<Skill, 'id' | 'level' | 'execute' | 'key'>
    & Partial<Pick<Skill, 'alwaysUsable'>>

type SkillTextVars = {
    title: string
    description: string
}

export default class Skill {
    private static _getPath(subFolder: string, key: string): string {
        return join('skills', subFolder, key)
    }

    id: number
    level: number
    alwaysUsable: boolean
    key: string
    execute: {
        sender: SkillMethod[]
        target: SkillMethod[]
    }

    constructor({
        id,
        level,
        alwaysUsable,
        key,
        execute
    }: SkillConstructorOptions) {
        this.id = id
        this.level = level
        this.alwaysUsable = alwaysUsable ?? false
        this.key = key
        this.execute = execute
    }

    getVars(ctx: BotContext): SkillTextVars {
        return {
            title: ctx.t(
                Skill._getPath('title', this.key),
            ),
            description: ctx.t(
                Skill._getPath('description', this.key),
            ),
        }
    }
}