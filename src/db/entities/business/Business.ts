import { index, prop } from "@typegoose/typegoose"
import IdEntity from "../base/IdEntity"
import BusinessStake from "./BusinessStake"
import { MAX_BUSINESS_STAKES } from "../../../consts/number"
import type { BotContext } from "../../../types/bot"
import type { BusinessType } from "../../../types/unions"

type ConstructorOptions =
    & Pick<Business, 'chatId' | 'type' | 'title'>
    & Partial<Pick<Business, 'stakePrice'>>
    & {
        owner: number
    }

@index(
    {
        id: 1
    },
    {
        unique: true
    }
)
export default class Business extends IdEntity {
    static buckwheatShop(ctx: BotContext): Business {
        const chatId = ctx.vars.chatId!
        const owner = ctx.me.id
        const title = ctx.t('business/buckwheat/shop')

        return new Business({
            chatId,
            owner,
            title,
            type: 'shop'
        })
    }

    @prop()
    chatId: number

    @prop()
    type: BusinessType

    @prop({ type: String })
    title: string

    @prop()
    stakePrice: number | undefined

    @prop({ type: [BusinessStake] })
    stakes: BusinessStake[]

    @prop()
    createdAt: Date

    constructor({
        chatId,
        type,
        owner,
        title,
        stakePrice,
    }: ConstructorOptions) {
        super()

        this.chatId = chatId
        this.type = type
        this.title = title

        this.stakes = [
            new BusinessStake({
                chatId,
                id: owner,
                count: MAX_BUSINESS_STAKES
            })
        ]

        this.createdAt = new Date()
        this.stakePrice = stakePrice
    }
}