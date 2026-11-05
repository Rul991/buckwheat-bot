import { prop } from "@typegoose/typegoose"
import BaseEntity from "../base/BaseEntity"

type ConstructorOptions =
    & Omit<DuelStep, 'createdAt'>

export default class DuelStep extends BaseEntity {
    @prop()
    duelist: number

    @prop({ index: true })
    chatId: number

    @prop()
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