import { prop } from "@typegoose/typegoose"
import ChatIdEntity from "../base/ChatIdEntity"

export default class Duelist extends ChatIdEntity {
    @prop()
    hp: number

    @prop()
    mana: number

    @prop()
    lastSave: Date

    @prop()
    shield: number

    constructor({
        chatId,
        id,
    }: Pick<Duelist, 'chatId' | 'id'>) {
        super(chatId, id)
        this.hp = 0
        this.mana = 0
        this.shield = 0
        this.lastSave = new Date(0)
    }
}