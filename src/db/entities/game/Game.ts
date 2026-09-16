import { index, modelOptions, prop } from "@typegoose/typegoose"
import ChatIdEntity from "../base/ChatIdEntity"

@index(
    {
        chatId: 1,
        id: 1,
        type: 1
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
export default class Game extends ChatIdEntity {
    @prop()
    wins: number

    @prop()
    loses: number

    @prop()
    onGame: boolean

    @prop()
    lastMessage?: number

    @prop()
    type: string

    constructor({
        chatId,
        id,
        type
    }: Pick<Game, 'chatId' | 'id' | 'type'>) {
        super(chatId, id)
        this.type = type

        this.wins = 0
        this.loses = 0
        this.onGame = false
    }
}