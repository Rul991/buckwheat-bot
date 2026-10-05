import { index, prop } from "@typegoose/typegoose"
import IdEntity from "../base/IdEntity"

type ConstructorOptions = 
    & Pick<Antispam, 'id'>

@index({ id: 1 }, { unique: true })
export default class Antispam extends IdEntity {
    @prop()
    messages: number

    @prop()
    createdAt: Date

    constructor({
        id,
    }: ConstructorOptions) {
        super(id)

        this.createdAt = new Date()
        this.messages = 1
    }
}