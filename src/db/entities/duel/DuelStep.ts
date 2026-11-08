import { index, prop } from "@typegoose/typegoose"
import BaseEntity from "../base/BaseEntity"
import type Duel from "./Duel"
import DuelUtils from "../../../utils/duel/duel/DuelUtils"

type ConstructorOptions =
    & Pick<DuelStep, 'duelist' | 'chatId'>
    & {
        duel: Duel
        damage?: number
    }

@index({
    chatId: 1,
    duelist: 1
})
export default class DuelStep extends BaseEntity {
    @prop()
    duelist: number

    @prop()
    nextDuelist: number

    @prop({ index: true })
    chatId: number

    @prop()
    createdAt: Date

    @prop()
    damage: number

    constructor({
        duelist,
        chatId,
        duel,
        damage = 0
    }: ConstructorOptions) {
        super()
        this.duelist = duelist
        this.chatId = chatId

        this.createdAt = new Date()
        this.nextDuelist = DuelUtils.getEnemy(duel, duelist)
        this.damage = damage
    }
}