import { prop } from "@typegoose/typegoose"
import BaseEntity from "../base/BaseEntity"

type ConstructorOptions =
    & Omit<DuelStep, 'createdAt'>

export default class DuelStep extends BaseEntity {
    @prop()
    duelist: number

    @prop({ unique: true })
    chatId: number

    @prop({ index: true })
    createdAt: Date

    constructor({
        duelist,
        chatId,
    }: ConstructorOptions) {
        super()
        this.duelist = duelist
        this.chatId = chatId
        this.createdAt = new Date()
    }
}