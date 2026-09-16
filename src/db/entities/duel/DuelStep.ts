import { prop } from "@typegoose/typegoose"
import BaseEntity from "../base/BaseEntity"

type ConstructorOptions = 
    & Pick<DuelStep, 'duelist'>

export default class DuelStep extends BaseEntity {
    @prop()
    duelist: number

    constructor({
        duelist
    }: ConstructorOptions) {
        super()
        this.duelist = duelist
    }
}