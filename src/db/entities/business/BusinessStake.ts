import { prop } from "@typegoose/typegoose"
import IdEntity from "../base/IdEntity"

type ConstructorOptions =
    & Omit<BusinessStake, '_id' | 'saleCount'>

export default class BusinessStake extends IdEntity {
    @prop()
    chatId: number

    @prop()
    count: number

    @prop()
    saleCount: number

    constructor({
        chatId,
        id,
        count
    }: ConstructorOptions) {
        super(id)
        this.chatId = chatId
        this.count = count
        this.saleCount = 0
    }
}