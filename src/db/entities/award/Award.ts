import { index, modelOptions, plugin, prop } from "@typegoose/typegoose"
import ChatIdEntity from "../base/ChatIdEntity"
import { autoIncrementPlugin } from "../../plugins/auto-increment"

@plugin(autoIncrementPlugin, { field: 'awardId' })
@index(
    {
        chatId: 1,
        id: 1,
        awardId: 1
    },
    {
        unique: true
    }
)
@modelOptions({
    options: {
        disableLowerIndexes: true
    }
})
export default class Award extends ChatIdEntity {
    @prop()
    text: string

    @prop({ index: true })
    rank: number

    @prop()
    giverId: number

    @prop({ unique: true })
    awardId!: number

    @prop()
    createdAt: Date

    constructor({
        chatId,
        id,
        text,
        rank,
        giverId,
    }: Omit<Award, 'awardId' | 'createdAt'>) {
        super(chatId, id)
        this.text = text
        this.rank = rank
        this.giverId = giverId
        this.createdAt = new Date()
    }
}