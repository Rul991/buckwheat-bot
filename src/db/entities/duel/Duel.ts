import { prop } from "@typegoose/typegoose"
import BaseEntity from "../base/BaseEntity"

type DuelConstructorOptions =
    & Pick<Duel, 'duelists' | 'chatId'>

export default class Duel extends BaseEntity {
    @prop({ type: [Number] })
    duelists: number[]

    @prop({ unique: true })
    chatId: number

    constructor({
        duelists,
        chatId,
    }: DuelConstructorOptions) {
        super()

        this.duelists = duelists
        this.chatId = chatId
    }
}