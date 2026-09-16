import { index, prop } from "@typegoose/typegoose"
import IdEntity from "../base/IdEntity"

@index(
    {
        id: 1,
        command: 1
    },
    {
        unique: true
    }
)
export default class ShortCommand extends IdEntity {
    @prop()
    command: string

    @prop()
    text: string

    constructor({
        id,
        command,
        text
    }: Omit<ShortCommand, '_id'>) {
        super(id)
        this.command = command
        this.text = text
    }
}