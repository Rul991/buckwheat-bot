import { VOTE_TIME } from '../../../utils/values/consts'
import IdeaUtils from '../../../utils/IdeaUtils'
import { CallbackButtonContext } from '../../../utils/values/types'
import IdeasService from '../../db/services/ideas/IdeasService'
import CallbackButtonAction from '../CallbackButtonAction'
import IdeaChangeAction from './IdeaChangeAction'

export default class VoteAction extends CallbackButtonAction {
    constructor() {
        super()
        this._name = 'vote'
    }

    async execute(ctx: CallbackButtonContext, data: string): Promise<string | void> {
        const splittedData = data.split('_')
        const key = splittedData[0] as 'coolVote' | 'badVote'
        const page = +splittedData[1]
        const userId = +splittedData[2]

        const ideas = await IdeasService.getIdeas()
        const idea = ideas[page]

        if(!idea) {
            return 'Такой идеи нет!'
        }

        if(!IdeaUtils.canVote(idea.createdAtTime!)) {
            return 'Время голосование прошло!'
        }
        
        for (const voter of idea.voters!) {
            if(ctx.from.id == voter) {
                return 'Вы уже голосовали!'
            }
        }

        await IdeasService.update(page, {
            [key]: idea[key]! + 1,
            voters: [...idea.voters!, ctx.from.id]
        })

        const newIdea = await IdeasService.getIdea(page)
        if(newIdea) {
            await IdeaChangeAction.editMessage(
                ctx,
                newIdea,
                ideas.length,
                page,
                userId
            )
        }

        return key == 'coolVote' ? '👍' : '👎'
    }
}