import { index, prop } from "@typegoose/typegoose"
import IdEntity from "../base/IdEntity"
import { GrammaticalCase } from "../../../protos/rp_pb"

type ConstructorOptions =
    & Pick<Roleplay, 'id' | 'name' | 'text'>
    & Partial<Pick<Roleplay, 'case'>>

@index(
    {
        id: 1,
        name: 1
    },
    {
        unique: true
    }
)
export default class Roleplay extends IdEntity {
    @prop()
    name: string

    @prop({ type: Number, enum: GrammaticalCase })
    case: GrammaticalCase

    @prop()
    text: string

    constructor({
        id,
        name,
        text,
        case: grammaticalCase
    }: ConstructorOptions) {
        super(id)
        this.name = name
        this.text = text
        this.case = grammaticalCase ?? GrammaticalCase.Genitive
    }
}