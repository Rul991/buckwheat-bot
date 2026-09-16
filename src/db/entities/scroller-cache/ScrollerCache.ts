import { index, modelOptions, prop, Severity } from "@typegoose/typegoose"
import BaseEntity from "../base/BaseEntity"
import { SECONDS_IN_MINUTE } from "../../../consts/time"

@index(
    {
        chatId: 1,
        msgId: 1
    },
    {
        unique: true
    }
)
@index(
    {
        updatedAt: 1
    },
    {
        expireAfterSeconds: SECONDS_IN_MINUTE * 5
    }
)
@modelOptions({
    options: {
        allowMixed: Severity.ALLOW
    }
})
export default class ScrollerCache extends BaseEntity {
    @prop()
    chatId: number

    @prop()
    msgId: number

    @prop({ type: Array })
    objects: any[]

    @prop()
    updatedAt: Date

    constructor({
        chatId,
        msgId,
        objects
    }: Omit<ScrollerCache, 'updatedAt' | '_id'>) {
        super()
        this.chatId = chatId
        this.msgId = msgId
        this.objects = objects
        this.updatedAt = new Date()
    }
}