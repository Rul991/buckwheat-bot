import { index, plugin, prop } from "@typegoose/typegoose"
import IdEntity from "../base/IdEntity"
import IdeaVote from "./IdeaVote"
import { IDEA_VOTE_TIME } from "../../../consts/time"
import TimeUtils from "../../../utils/time/TimeUtils"
import UserService from "../../services/user/UserService"
import type { BotContext } from "../../../types/bot"
import { DEV_ID } from "../../../consts/env"
import { UNKNOWN_NAME } from "../../../consts/texts"
import { autoIncrementPlugin } from "../../plugins/auto-increment"

type ShowOptions = {
    ctx: BotContext
    idea: Idea
}

@index(
    {
        id: 1
    },
    {
        unique: true
    }
)
@plugin(autoIncrementPlugin)
export default class Idea extends IdEntity {
    static dummy(): Idea {
        return new Idea({
            author: [0, 0],
            text: '...',
        })
    }

    static canVote(idea: Idea): boolean {
        return !TimeUtils.isExpired(
            +idea.createdAt,
            IDEA_VOTE_TIME
        )
    }

    static canDelete(idea: Idea, id: number): boolean {
        const [_chatId, userId] = idea.author
        return id == userId || id == DEV_ID
    }

    static async message({
        idea,
        ctx,
    }: ShowOptions) {
        const [chatId, id] = idea.author

        const vote = idea.votes.reduce(
            (total, vote) => {
                const key = vote.isCool ? 'cool' : 'bad'
                total[key]++
                return total
            },
            {
                cool: 0,
                bad: 0,
                can: this.canVote(idea)
            }
        )

        return {
            key: 'idea/show',
            vars: {
                user: (await UserService.get(chatId, id)) ?? { id, name: UNKNOWN_NAME },
                vote,
                date: TimeUtils.formatMillisecondsToTime(ctx, TimeUtils.getElapsed(+idea.createdAt)),
                text: idea.text,
                idea
            },
            keyboard: ctx.msg?.reply_markup
        }
    }

    @prop({
        type: [Number, Number]
    })
    author: [number, number]

    @prop()
    text: string

    @prop({ type: [IdeaVote] })
    votes: IdeaVote[]

    @prop({ index: true })
    createdAt: Date

    constructor({
        author,
        text,
    }: Omit<Idea, '_id' | 'votes' | 'id' | 'createdAt'>) {
        super()

        this.author = author
        this.text = text

        this.votes = []
        this.createdAt = new Date()
    }
}