import { index, plugin, prop } from "@typegoose/typegoose"
import IdEntity from "../base/IdEntity"
import { autoIncrementPlugin } from "../../plugins/auto-increment"
import type Item from "../../../utils/items/Item"
import { MARKET_SLOT_EXPIRE_SECONDS } from "../../../consts/time"

type ConstructorOptions = Omit<MarketSlot, 'id' | 'itemId' | 'createdAt'>
    & {
        item: Item
    }

@plugin(autoIncrementPlugin)
@index(
    {
        itemId: -1,
        count: -1,
        price: 1
    }
)
@index(
    {
        createdAt: 1
    },
    {
        expireAfterSeconds: MARKET_SLOT_EXPIRE_SECONDS
    }
)
export default class MarketSlot extends IdEntity {
    @prop({ unique: true })
    declare id: number

    @prop()
    chatId: number

    @prop()
    seller: number

    @prop()
    price: number

    @prop()
    count: number

    @prop()
    itemId: number

    @prop()
    createdAt: Date

    constructor({
        chatId,
        seller,
        price,
        count,
        item,
    }: ConstructorOptions) {
        super()
        this.chatId = chatId
        this.itemId = item.id
        this.seller = seller
        this.price = price
        this.count = count
        this.createdAt = new Date()
    }
}