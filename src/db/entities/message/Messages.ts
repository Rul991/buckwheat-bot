import { index, modelOptions, prop } from "@typegoose/typegoose"
import ChatIdEntity from "../base/ChatIdEntity"
import type { MessagesType } from "../../../types/unions"
import DateUtils from "../../../utils/time/DateUtils"

@index(
    {
        chatId: 1,
        id: 1,
        type: 1
    },
    {
        unique: true
    }
)
@index(
    {
        expiresDate: 1
    },
    {
        expireAfterSeconds: 0
    }
)
@modelOptions({
    options: {
        disableLowerIndexes: true
    }
})
export default class Messages extends ChatIdEntity {
    private static readonly _expiresDates: Record<MessagesType, () => Date | undefined> = {
        total: () => undefined,
        day: () => DateUtils.nextDay(),
        month: () => DateUtils.nextMonth(),
        year: () => DateUtils.nextYear(),
    }

    @prop({ type: String })
    type: MessagesType

    @prop()
    expiresDate: Date | undefined

    @prop()
    count: number

    constructor({
        chatId,
        id,
        type
    }: Omit<Messages, '_id' | 'expiresDate' | 'count'>) {
        super(chatId, id)

        this.count = 0
        this.type = type
        this.expiresDate = Messages._expiresDates[type]()
    }
}