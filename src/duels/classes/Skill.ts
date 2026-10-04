import { join } from "path/posix"
import type { BotContext } from "../../types/bot"
import type SkillMethod from "../methods/SkillMethod"

type SkillConstructorOptions =
    & Pick<Skill, 'id' | 'level' | 'methods' | 'key'>

type SkillTextVars = {
    title: string
    description: string
}

export default class Skill {
    private static _getPath(type: string, key: string): string {
        return join('skills/texts/', key, type)
    }

    id: number
    level: number
    key: string
    methods: {
        caster: SkillMethod[]
        target: SkillMethod[]
    }

    constructor({
        id,
        level,
        key,
        methods
    }: SkillConstructorOptions) {
        this.id = id
        this.level = level
        this.key = key
        this.methods = methods
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