import { index, prop } from "@typegoose/typegoose"
import IdEntity from "../base/IdEntity"

@index(
    {
        id: 1
    },
    {
        unique: true
    }
)
export default class Chat extends IdEntity {
    @prop()
    title: string

    @prop()
    hello: string

    @prop({ index: true })
    isPublic: boolean

    @prop()
    canUseSummonNow: boolean

    @prop()
    stickerPack?: string

    constructor({
        id,
        title,
    }: Pick<Chat, 'title' | 'id'>) {
        super(id)

        this.title = title
        this.hello = ''
        this.isPublic = false
        this.canUseSummonNow = true
    }
}