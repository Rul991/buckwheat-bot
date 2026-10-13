import { prop } from "@typegoose/typegoose"
import ChatIdEntity from "../base/ChatIdEntity"

export default class Level extends ChatIdEntity {
    @prop()
    currentExperience: number = 0
    
    @prop()
    prevExperience: number = 0

    @prop()
    isLevelUpChecked: boolean

    constructor({
        chatId,
        id,
    }: Pick<Level, 'chatId' | 'id'>) {
        super(chatId, id)
        this.isLevelUpChecked = true
    }
}