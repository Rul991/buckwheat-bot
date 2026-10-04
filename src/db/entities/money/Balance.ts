import { prop } from "@typegoose/typegoose"
import ChatIdEntity from "../base/ChatIdEntity"
import { START_MONEY } from "../../../consts/number"

export default class Balance extends ChatIdEntity {
    static default(chatId: number, id: number): Balance {
        return new Balance({
            chatId,
            id,
            total: START_MONEY
        })
    }

    @prop()
    total: number

    constructor({
        chatId,
        id,
        total
    }: Omit<Balance, '_id'>) {
        super(chatId, id)
        this.total = total
    }
}