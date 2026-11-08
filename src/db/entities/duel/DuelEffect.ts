import { index, prop } from "@typegoose/typegoose"
import BaseEntity from "../base/BaseEntity"
import type Skill from "../../../utils/duel/skill/Skill"

type ConstructorOptions =
    & Omit<DuelEffect, 'skillId'>
    & {
        skill: Skill
    }

@index({
    chatId: 1,
    target: 1,
    caster: 1,
    skillId: 1
})
export default class DuelEffect extends BaseEntity {
    @prop({ index: true })
    chatId: number

    @prop()
    target: number

    @prop()
    caster: number

    @prop()
    steps: number

    @prop()
    skillId: number

    constructor({
        chatId,
        target,
        caster,
        steps,
        skill
    }: ConstructorOptions) {
        super()
        
        this.chatId = chatId
        this.target = target
        this.caster = caster

        this.steps = steps
        this.skillId = skill.id
    }
}