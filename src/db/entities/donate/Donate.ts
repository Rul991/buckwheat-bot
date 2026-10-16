import { modelOptions, prop } from "@typegoose/typegoose"
import ChatIdEntity from "../base/ChatIdEntity"

@modelOptions({
    options: {
        disableLowerIndexes: true
    }
})
export default class Donate extends ChatIdEntity {
    @prop()
    stars: number

    constructor({
        chatId,
        id,
        stars
    }: Pick<Donate, 'chatId' | 'id' | 'stars'>) {
        super(chatId, id)
        this.stars = stars
    }
}