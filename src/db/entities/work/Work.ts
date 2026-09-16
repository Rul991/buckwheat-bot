import { prop } from "@typegoose/typegoose"
import ChatIdEntity from "../base/ChatIdEntity"

export default class Work extends ChatIdEntity {
    @prop()
    lastWork: Date

    constructor({
        chatId,
        id
    }: Pick<Work, 'chatId' | 'id'>) {
        super(chatId, id)
        this.lastWork = new Date(0)
    }
}