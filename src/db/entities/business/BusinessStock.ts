import { index, modelOptions, prop } from "@typegoose/typegoose"
import ChatIdEntity from "../base/ChatIdEntity"

type ConstructorOptions = Omit<BusinessStock, 'totalIncome'>

@index(
    {
        chatId: 1,
        id: 1,
        businessId: 1,
    },
    {
        unique: true
    }
)
@modelOptions({
    options: {
        disableLowerIndexes: true
    }
})
export default class BusinessStock extends ChatIdEntity {
    @prop()
    businessId: number

    @prop()
    count: number

    @prop()
    totalIncome: number

    constructor({
        chatId,
        id,
        businessId,
        count,
    }: ConstructorOptions) {
        super(chatId, id)
        this.businessId = businessId
        this.count = count
        this.totalIncome = 0
    }
}