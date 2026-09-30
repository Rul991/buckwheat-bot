import { plugin, prop } from "@typegoose/typegoose"
import IdEntity from "../base/IdEntity"
import { AutoIncrementID } from '@typegoose/auto-increment'

@plugin(
    AutoIncrementID, 
    {
        field: 'id',
    }
)
export default class Note extends IdEntity {
    @prop({ unique: true })
    declare id: number

    @prop()
    owner: number

    @prop()
    text: string

    @prop()
    folder: string  

    constructor({
        owner,
        text,
        folder
    }: Omit<Note, '_id' | 'id'>) {
        super()
        this.owner = owner
        this.text = text
        this.folder = folder
    }
}