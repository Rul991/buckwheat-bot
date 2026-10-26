import { index, plugin, prop } from "@typegoose/typegoose"
import { autoIncrementPlugin } from "../../plugins/auto-increment"
import type { BuckwheatBusinessOptions, BusinessType } from "../../../types/business"
import IdEntity from "../base/IdEntity"

type ConstructorOptions =
    & Omit<Business, 'id'>

@index(
    {
        id: 1
    },
    {
        unique: true
    }
)
@plugin(autoIncrementPlugin)
export default class Business extends IdEntity {
    static buckwheat({
        type,
        ctx
    }: BuckwheatBusinessOptions): Business {
        const owner = ctx.me.id
        const chatId = ctx.vars.chatId!
        const title = ctx.t(`business/types/${type}/buckwheat`)

        return new Business({
            owner,
            type,
            title,
            chatId
        })
    }

    @prop({ index: true })
    chatId: number

    @prop({ index: true })
    owner: number

    @prop({ type: String, index: true })
    type: BusinessType

    @prop()
    title: string

    constructor({
        chatId,
        owner,
        type,
        title
    }: ConstructorOptions) {
        super()
        this.owner = owner
        this.type = type
        this.title = title
        this.chatId = chatId
    }
}