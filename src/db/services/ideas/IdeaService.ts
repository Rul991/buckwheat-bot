import type { UpdateWriteOpResult } from "mongoose"
import Idea from "../../entities/ideas/Idea"
import type IdeaVote from "../../entities/ideas/IdeaVote"
import BaseService from "../base/BaseService"

type VoteResult =
    | {
        ok: true
        idea: Idea
        newVote: boolean
    }
    | {
        ok: false
        reason: string
    }

class IdeaService extends BaseService<typeof Idea> {
    constructor() {
        super(Idea)
    }

    async get(id: number): Promise<Idea | undefined> {
        return await this._repo.findOne({
            id
        })
    }

    async vote(id: number, vote: IdeaVote): Promise<VoteResult> {
        const idea = await this.get(id)
        if (!idea) return { ok: false, reason: 'no-idea' }

        if (!Idea.canVote(idea)) {
            return {
                ok: false,
                reason: 'end-vote'
            }
        }

        const voteIndex = idea.votes.findIndex(v => v.id == vote.id)
        if (voteIndex != -1) {
            const isSameVotes = vote.isCool === idea.votes[voteIndex]?.isCool
            idea.votes.splice(voteIndex, 1)

            const newIdea = await this._repo.updateOne(
                {
                    id
                },
                {
                    votes: idea.votes
                }
            )

            if (isSameVotes) {
                return { ok: true, newVote: false, idea: newIdea! }
            }
        }

        await this._repo.updateOne(
            {
                id
            },
            {
                votes: [
                    ...idea.votes,
                    vote
                ]
            }
        )
        return { ok: true, newVote: true, idea: (await this.get(id))! }
    }

    async delete(ideaId: number, userId: number): Promise<boolean> {
        const idea = await this.get(ideaId)
        if (!idea) return false

        const canDelete = Idea.canDelete(idea, userId)
        if (!canDelete) {
            return false
        }

        return (await this._repo.deleteOne({ id: ideaId })).acknowledged
    }

    async count(): Promise<number> {
        return this._repo.count()
    }

    override async migrate(filter: Partial<Idea>, value: Partial<Idea>): Promise<UpdateWriteOpResult> {
        const oldChatId = filter.author?.[0]
        const newChatId = value.author?.[0]
        if (!oldChatId || !newChatId) return {
            acknowledged: false,
            matchedCount: 0,
            modifiedCount: 0,
            upsertedCount: 0,
            upsertedId: null
        }

        return await this._repo.model.updateMany(
            {
                'author.0': oldChatId
            },
            {
                $set: {
                    'author.1': newChatId
                }
            }
        ).lean().exec()
    }
}

export default new IdeaService()