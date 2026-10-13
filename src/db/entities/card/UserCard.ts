import { prop } from "@typegoose/typegoose"
import ChatIdEntity from "../base/ChatIdEntity"

type ContructorOptions = Omit<UserCard, 'count'> & Partial<Pick<UserCard, 'count'>>

export default class UserCard extends ChatIdEntity {
    @prop()
    card: number

    @prop()
    count: number

    constructor({
        chatId,
        id,
        card,
        count = 0
    }: ContructorOptions) {
        super(chatId, id)
        this.card = card
        this.count = count
    }
}