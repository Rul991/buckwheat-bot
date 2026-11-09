import { join } from "path/posix"
import type { BotContext } from "../../../types/bot"
import type SkillMethod from "../methods/base/SkillMethod"

type SkillConstructorOptions =
    & Pick<Skill, 'id' | 'level' | 'key'>
    & {
        methods: Partial<Skill['methods']>
    }

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
        this.methods = {
            caster: methods.caster ?? [],
            target: methods.target ?? [],
        }
    }

    getTitle(ctx: BotContext) {
        return ctx.t(
            Skill._getPath('title', this.key),
        )
    }

    getVars(ctx: BotContext): SkillTextVars {
        return {
            title: this.getTitle(ctx),
            description: ctx.t(
                Skill._getPath('description', this.key),
            ),
        }
    }
}