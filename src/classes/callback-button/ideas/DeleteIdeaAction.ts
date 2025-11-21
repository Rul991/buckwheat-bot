import { JSONSchemaType } from 'ajv'
import ArrayUtils from '../../../utils/ArrayUtils'
import MessageUtils from '../../../utils/MessageUtils'
import { DEV_ID, NOT_FOUND_INDEX } from '../../../utils/values/consts'
import { CallbackButtonContext } from '../../../utils/values/types'
import IdeasService from '../../db/services/ideas/IdeasService'
import CallbackButtonAction from '../CallbackButtonAction'
import IdeaChangeAction from './IdeaChangeAction'
import ScrollerWithIdData from '../../../interfaces/callback-button-data/ScrollerWithIdData'
import { scrollerWithIdDataSchema } from '../../../utils/values/schemas'
import FileUtils from '../../../utils/FileUtils'

export default class DeleteIdeaAction extends CallbackButtonAction<ScrollerWithIdData> {
    protected _schema: JSONSchemaType<ScrollerWithIdData> = scrollerWithIdDataSchema

    constructor() {
        super()
        this._name = 'deleteidea'
    }

    async execute(ctx: CallbackButtonContext, data: ScrollerWithIdData): Promise<string | void> {
        if(ctx.from.id !== DEV_ID) return await FileUtils.readPugFromResource('text/actions/idea/no-dev.pug')

        const {current, id} = data
        const ideas = await IdeasService.getIdeas()
        
        if(!ideas[current]) return await FileUtils.readPugFromResource('text/actions/idea/no-idea.pug')
        else {
            await IdeasService.delete(current)
            
            const newIdeas = await IdeasService.getIdeas()
            const newPage = ArrayUtils.getNearIndex(current, newIdeas)

            if(newPage != NOT_FOUND_INDEX) {
                await IdeaChangeAction.editMessage(
                    ctx,
                    newIdeas[newPage],
                    newIdeas.length,
                    newPage,
                    id
                )
            }
            else {
                await MessageUtils.deleteMessage(ctx)
            }
            
            return await FileUtils.readPugFromResource(
                'text/actions/idea/delete-idea.pug',
                {
                    changeValues: {
                        current
                    }
                }
            )
        }
    }
}