import { prop } from "@typegoose/typegoose"
import IdEntity from "../base/IdEntity"

export default class CoOwner extends IdEntity {
    @prop()
    stake: number

    constructor(id: number, stake: number) {
        super(id)
        this.stake = stake
    }
}