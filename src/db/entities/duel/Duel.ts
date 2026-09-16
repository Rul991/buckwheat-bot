import { index, prop } from "@typegoose/typegoose"
import IdEntity from "../base/IdEntity"
import DuelStep from "./DuelStep"

type DuelConstructorOptions =
    & Pick<Duel, 'firstDuelist' | 'secondDuelist'>

@index(
    {
        id: 1
    },
    {
        unique: true
    }
)
export default class Duel extends IdEntity {
    @prop()
    firstDuelist: number

    @prop()
    secondDuelist: number

    @prop({ type: [DuelStep] })
    steps: DuelStep[]

    constructor({
        firstDuelist,
        secondDuelist,
    }: DuelConstructorOptions) {
        super()

        this.firstDuelist = firstDuelist
        this.secondDuelist = secondDuelist
        this.steps = []
    }
}