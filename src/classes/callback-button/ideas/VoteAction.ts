import { JSONSchemaType } from 'ajv'
import VoteData from '../../../interfaces/callback-button-data/VoteData'
import IdeaUtils from '../../../utils/IdeaUtils'
import { CallbackButtonContext } from '../../../utils/values/types/types'
import IdeasService from '../../db/services/ideas/IdeasService'
import CallbackButtonAction from '../CallbackButtonAction'
import IdeaChangeAction from './IdeaChangeAction'
import FileUtils from '../../../utils/FileUtils'

export default class VoteAction extends CallbackButtonAction<VoteData> {
    protected _schema: JSONSchemaType<VoteData> = {
        type: 'object',
        properties: {
            isCool: {type: 'boolean'},
            current: {type: 'number'},
            id: {type: 'number'},
        },
        required: ['current', 'id', 'isCool']
    }

    constructor() {
        super()
        this._name = 'vote'
    }

    async execute(ctx: CallbackButtonContext, {isCool, current, id}: VoteData): Promise<string | void> {
        const key = isCool ? 'coolVote' : 'badVote'

        const ideas = await IdeasService.getIdeas()
        const idea = ideas[current]

        if(!idea) {
            return await FileUtils.readPugFromResource('text/actions/idea/no-idea.pug')
        }

        if(!IdeaUtils.canVote(idea.createdAtTime!)) {
            return await FileUtils.readPugFromResource('text/actions/vote/timeout.pug')
        }
        
        for (const voter of idea.voters!) {
            if(ctx.from.id == voter) {
                return await FileUtils.readPugFromResource('text/actions/vote/cant.pug')
            }
        }

        await IdeasService.update(current, {
            [key]: idea[key]! + 1,
            voters: [...idea.voters!, ctx.from.id]
        })

        const newIdea = await IdeasService.getIdea(current)
        if(newIdea) {
            await IdeaChangeAction.editMessage(
                ctx,
                newIdea,
                ideas.length,
                current,
                id
            )
        }

        const isCoolVote = key == 'coolVote'
        return await FileUtils.readPugFromResource(
            'text/actions/vote/can.pug',
            {
                changeValues: {
                    isCool: isCoolVote
                }
            }
        )
    }
}