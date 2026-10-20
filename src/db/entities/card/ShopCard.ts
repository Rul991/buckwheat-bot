import { index, plugin, prop } from "@typegoose/typegoose"
import IdEntity from "../base/IdEntity"
import { autoIncrementPlugin } from "../../plugins/auto-increment"
import { SHOP_CARD_SLOT_EXPIRE_SECONDS } from "../../../consts/time"

@plugin(autoIncrementPlugin)
@index(
    {
        createdAt: 1
    },
    {
        expireAfterSeconds: SHOP_CARD_SLOT_EXPIRE_SECONDS
    }
)
@index(
    {
        id: 1
    },
    {
        unique: true
    }
)
export default class ShopCard extends IdEntity {
    @prop({ index: true })
    seller: number

    @prop()
    count: number

    @prop()
    price: number

    @prop({ index: true })
    card: number

    @prop({ index: true })
    chatId: number

    @prop()
    createdAt: Date

    constructor({
        seller,
        count,
        price,
        card,
        chatId
    }: Omit<ShopCard, 'id' | 'createdAt'>) {
        super()
        this.chatId = chatId
        this.seller = seller
        this.count = count
        this.price = price
        this.card = card
        this.createdAt = new Date()
    }
}