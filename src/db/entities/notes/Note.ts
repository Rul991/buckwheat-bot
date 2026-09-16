import { plugin, prop } from "@typegoose/typegoose"
import IdEntity from "../base/IdEntity"
import { autoIncrementPlugin } from "../../plugins/auto-increment"

@plugin(autoIncrementPlugin)
export default class Note extends IdEntity {
    @prop({ unique: true })
    declare id: number

    @prop()
    owner: number

    @prop()
    text: string

    constructor({
        owner,
        text,
        id
    }: Omit<Note, '_id' | 'id'> & { id?: number }) {
        super(id)
        this.owner = owner
        this.text = text
    }
}