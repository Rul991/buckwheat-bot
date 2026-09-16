import { index, prop } from "@typegoose/typegoose"
import IdEntity from "./IdEntity"

@index(
    {
        chatId: 1,
        id: 1
    },
    {
        unique: true
    }
)
export default abstract class ChatIdEntity extends IdEntity {
    @prop()
    chatId: number

    constructor(chatId: number, id: number) {
        super(id)
        this.chatId = chatId
    }
}