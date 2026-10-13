import { plugin, prop } from "@typegoose/typegoose"
import IdEntity from "../base/IdEntity"
import { autoIncrementPlugin } from "../../plugins/auto-increment"

@plugin(autoIncrementPlugin)
export default class ShopCard extends IdEntity {
    @prop()
    seller: number

    @prop()
    count: number

    @prop()
    price: number

    @prop()
    card: number

    @prop()
    chatId: number

    constructor({
        seller,
        count,
        price,
        card,
        chatId
    }: Omit<ShopCard, 'id'>) {
        super()
        this.chatId = chatId
        this.seller = seller
        this.count = count
        this.price = price
        this.card = card
    }
}