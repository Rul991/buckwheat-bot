import { plugin, prop } from "@typegoose/typegoose"
import ChatIdEntity from "../base/ChatIdEntity"
import { AutoIncrementID } from "@typegoose/auto-increment"

@plugin(
    AutoIncrementID, 
    {
        field: 'id',
    }
)
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