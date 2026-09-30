import { index, prop } from "@typegoose/typegoose"
import BaseEntity from "../base/BaseEntity"

@index(
    {
        chatId: 1,
        firstPartner: 1,
    },
    {
        unique: true
    }
)
@index(
    {
        chatId: 1,
        secondPartner: 1,
    },
    {
        unique: true
    }
)
export default class Marriage extends BaseEntity {
    static getPartner(marriage: Marriage, userId: number): number {
        return marriage.firstPartner == userId ? marriage.secondPartner : marriage.firstPartner
    }

    @prop()
    chatId: number

    @prop()
    createdAt: Date

    @prop()
    firstPartner: number

    @prop()
    secondPartner: number

    constructor({
        chatId,
        firstPartner,
        secondPartner
    }: Omit<Marriage, 'createdAt'>) {
        super()
        this.chatId = chatId
        this.createdAt = new Date()

        this.firstPartner = firstPartner
        this.secondPartner = secondPartner
    }
}