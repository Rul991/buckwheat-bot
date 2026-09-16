import { prop } from "@typegoose/typegoose"
import IdEntity from "../base/IdEntity"

export default class IdeaVote extends IdEntity {
    @prop()
    isCool: boolean

    constructor({
        id,
        isCool
    }: Omit<IdeaVote, '_id'>) {
        super(id)
        this.isCool = isCool
    }
}