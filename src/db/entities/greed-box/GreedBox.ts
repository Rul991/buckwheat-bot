import { prop } from "@typegoose/typegoose"
import ChatIdEntity from "../base/ChatIdEntity"

export default class GreedBox extends ChatIdEntity {
    @prop()
    used: number

    constructor({
        chatId,
        id
    }: Pick<GreedBox, 'chatId' | 'id'>) {
        super(chatId, id)
        this.used = 0
    }
}