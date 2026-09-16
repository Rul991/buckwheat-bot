import { index, prop } from "@typegoose/typegoose"
import ChatIdEntity from "../base/ChatIdEntity"
import type { ClassTypes } from "../../../types/class"
import ClassUtils from "../../../utils/db/ClassUtils"
import RankUtils from "../../../utils/db/RankUtils"
import AvaHistory from "./AvaHistory"
import { MAX_DESCRIPTION_LENGTH, MAX_NAME_LENGTH, MIN_DESCRIPTION_LENGTH, MIN_NAME_LENGTH } from "../../../consts/lengths"

@index(
    {
        chatId: 1,
        name: 1
    },
    {
        unique: true
    }
)
export default class User extends ChatIdEntity {
    @prop({ index: true, minlength: MIN_NAME_LENGTH, maxlength: MAX_NAME_LENGTH })
    name: string

    @prop({ minlength: MIN_DESCRIPTION_LENGTH, maxlength: MAX_DESCRIPTION_LENGTH })
    description: string

    @prop({
        type: String,
        enum: ClassUtils.classNames
    })
    className: ClassTypes

    @prop()
    rank: number

    @prop({ type: AvaHistory })
    currentAva?: AvaHistory

    @prop({
        type: [AvaHistory]
    })
    avaHistory: AvaHistory[]

    @prop()
    adminTitle?: string

    @prop()
    username?: string

    @prop()
    createdAt: Date

    @prop()
    updatedAt: Date

    @prop()
    classChangedCount: number

    constructor({
        chatId,
        id,
        name,
        description = '',
        className = 'unknown',
        username,
        rank = RankUtils.min
    }: Pick<User, 'chatId' | 'id' | 'name'> & Partial<Pick<User, 'className' | 'description' | 'username' | 'rank'>>) {
        super(chatId, id)
        this.name = name
        this.description = description

        this.className = className
        this.rank = rank
        this.username = username
        this.avaHistory = []

        this.createdAt = new Date()
        this.updatedAt = this.createdAt
        this.classChangedCount = 0
    }
}