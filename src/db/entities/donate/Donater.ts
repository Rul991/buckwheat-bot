import { prop } from "@typegoose/typegoose"
import IdEntity from "../base/IdEntity"

export default class Donater extends IdEntity {
    @prop()
    stars: number

    constructor({
        id,
        stars
    }: Donater) {
        super(id)
        this.stars = stars
    }
}