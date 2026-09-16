import { prop } from "@typegoose/typegoose"
import BaseEntity from "./BaseEntity"

export default abstract class IdEntity extends BaseEntity {
    @prop()
    id!: number

    constructor(id?: number) {
        super()

        if(id !== undefined) {
            this.id = id
        }
    }
}