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
@index({ owner: 1 })
@plugin(autoIncrementPlugin)
export default class NoteFolder extends IdEntity {
    @prop()
    owner: number

    @prop()
    title: string

    @prop()
    isPublic: boolean

    @prop()
    createdAt: Date

    constructor({
        owner,
        title,
        isPublic,
    }: Pick<NoteFolder, 'owner' | 'title' | 'isPublic'>) {
        super()
        this.owner = owner
        this.title = title

        this.isPublic = isPublic
        this.createdAt = new Date()
    }
}
