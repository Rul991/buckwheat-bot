import TimeUtils from './TimeUtils'
import { VOTE_TIME } from './values/consts'

export default class IdeaUtils {
    static canVote(createdAtTime: number): boolean {
        return !TimeUtils.isTimeExpired(createdAtTime!, VOTE_TIME)
    }
}