import { prop } from "@typegoose/typegoose"
import BaseEntity from "../base/BaseEntity"

type DuelConstructorOptions =
    & Pick<Duel, 'duelists' | 'chatId' | 'prize'>

export default class Duel extends BaseEntity {
    @prop({ type: [Number] })
    duelists: number[]

    @prop({ unique: true })
    chatId: number

    @prop()
    prize: number

    @prop()
    createdAt: Date

    constructor({
        duelists,
        chatId,
        prize,
    }: DuelConstructorOptions) {
        super()

        this.duelists = duelists
        this.chatId = chatId
        this.prize = prize
        this.createdAt = new Date()
    }
}