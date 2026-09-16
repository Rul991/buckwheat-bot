import { plugin, prop } from "@typegoose/typegoose"
import ChatIdEntity from "../base/ChatIdEntity"
import { autoIncrementPlugin } from "../../plugins/auto-increment"

@plugin(autoIncrementPlugin)
export default class Rule extends ChatIdEntity {
    @prop()
    text: string

    constructor({
        chatId,
        text,
    }: Omit<Rule, '_id' | 'id'>) {
        super(chatId, 0)
        this.text = text
    }
}