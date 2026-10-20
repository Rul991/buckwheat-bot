import { index, modelOptions, prop } from "@typegoose/typegoose"
import ChatIdEntity from "../base/ChatIdEntity"

type ContructorOptions = Omit<UserCard, 'count'> & Partial<Pick<UserCard, 'count'>>

@index(
    {
        chatId: 1,
        id: 1,
        card: 1
    },
    {
        unique: true
    }
)
@modelOptions({
    options: {
        disableLowerIndexes: true
    }
})
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