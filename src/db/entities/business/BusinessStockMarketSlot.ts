import { index, prop } from "@typegoose/typegoose"
import BaseEntity from "../base/BaseEntity"

type ConstructorOptions = Omit<BusinessStockMarketSlot, 'createdAt'>

@index(
    {
        chatId: 1,
        seller: 1,
        businessId: 1,
    },
    {
        unique: true
    }
)
export default class BusinessStockMarketSlot extends BaseEntity {
    @prop()
    businessId: number

    @prop()
    count: number

    @prop()
    price: number

    @prop()
    createdAt: Date

    @prop()
    chatId: number

    @prop()
    seller: number

    constructor({
        chatId,
        seller,
        businessId,
        count,
        price
    }: ConstructorOptions) {
        super()

        this.chatId = chatId
        this.seller = seller
        this.businessId = businessId

        this.count = count
        this.price = price
        this.createdAt = new Date()
    }
}