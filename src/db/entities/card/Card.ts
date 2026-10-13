import { plugin, prop } from "@typegoose/typegoose"
import IdEntity from "../base/IdEntity"
import { autoIncrementPlugin } from "../../plugins/auto-increment"

@plugin(autoIncrementPlugin)
export default class Card extends IdEntity {
    @prop()
    name: string

    @prop()
    description: string

    @prop()
    image: string

    @prop()
    rarity: number

    @prop()
    isSuggested: boolean

    constructor({
        name,
        description,
        image,
        rarity,
        isSuggested
    }: Omit<Card, 'id'>) {
        super()
        this.name = name
        this.description = description
        this.image = image
        this.rarity = rarity
        this.isSuggested = isSuggested
    }
}