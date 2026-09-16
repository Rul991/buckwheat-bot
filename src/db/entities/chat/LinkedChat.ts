import { prop } from "@typegoose/typegoose"
import IdEntity from "../base/IdEntity"

export default class LinkedChat extends IdEntity {
    @prop({
        unique: true,
    })
    declare id: number

    @prop()
    linkedChat?: number

    @prop({
        type: [Number]
    })
    linkedChats: number[]

    constructor({
        id,
        linkedChat,
    }: Omit<LinkedChat, '_id' | 'linkedChats'>) {
        super(id)

        this.linkedChat = linkedChat
        this.linkedChats = []
    }
}