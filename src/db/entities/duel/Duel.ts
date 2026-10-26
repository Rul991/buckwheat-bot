import { prop } from "@typegoose/typegoose"
import BaseEntity from "../base/BaseEntity"

type DuelConstructorOptions =
    & Pick<Duel, 'firstDuelist' | 'secondDuelist' | 'chatId'>

export default class Duel extends BaseEntity {
    @prop()
    firstDuelist: number

    @prop()
    secondDuelist: number

    @prop({ unique: true })
    chatId: number

    constructor({
        firstDuelist,
        secondDuelist,
        chatId,
    }: DuelConstructorOptions) {
        super()

        this.firstDuelist = firstDuelist
        this.secondDuelist = secondDuelist
        this.chatId = chatId
    }
}