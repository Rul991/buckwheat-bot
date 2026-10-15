import { prop } from "@typegoose/typegoose"
import ChatIdEntity from "../base/ChatIdEntity"

type ConstructorOptions = Pick<Generator, 'chatId' | 'id'>

export default class Generator extends ChatIdEntity {
    @prop()
    generatorCount: number

    @prop()
    levels: number

    @prop()
    updatedAt: Date

    constructor({
        chatId,
        id,
    }: ConstructorOptions) {
        super(chatId, id)
        this.generatorCount = 0
        this.levels = 0
        this.updatedAt = new Date()
    }
}