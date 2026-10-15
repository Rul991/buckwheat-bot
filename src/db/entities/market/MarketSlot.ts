import { plugin, prop } from "@typegoose/typegoose"
import IdEntity from "../base/IdEntity"
import { autoIncrementPlugin } from "../../plugins/auto-increment"

type ConstructorOptions = Omit<MarketSlot, 'id'>

@plugin(autoIncrementPlugin)
export default class MarketSlot extends IdEntity {
    @prop()
    chatId: number

    @prop()
    owner: number

    @prop()
    price: number

    @prop()
    count: number

    @prop()
    itemId: number

    constructor({
        chatId,
        owner,
        price,
        count,
        itemId,
    }: ConstructorOptions) {
        super()
        this.chatId = chatId
        this.itemId = itemId
        this.owner = owner
        this.price = price
        this.count = count
    }
}