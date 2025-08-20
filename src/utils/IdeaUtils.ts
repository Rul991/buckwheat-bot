import { VOTE_TIME } from './consts'

export default class IdeaUtils {
    static canVote(createdAtTime: number): boolean {
        return (Date.now() - createdAtTime!) < VOTE_TIME
    }
}