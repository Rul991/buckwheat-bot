import { index, plugin, prop } from "@typegoose/typegoose"
import IdEntity from "../base/IdEntity"
import { autoIncrementPlugin } from "../../plugins/auto-increment"

@index(
    {
        id: 1
    },
    {
        unique: true
    }
)
@plugin(autoIncrementPlugin)
export default class Note extends IdEntity {
    @prop()
    text: string

    @prop({ index: true })
    folderId: number

    @prop()
    createdAt: Date

    constructor({
        text,
        folderId
    }: Pick<Note, 'text' | 'folderId'>) {
        super()
        this.text = text
        this.folderId = folderId
        this.createdAt = new Date()
    }
}