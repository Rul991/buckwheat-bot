import { ZodType } from 'zod'
import ArrayUtils from '../../../utils/ArrayUtils'
import MessageUtils from '../../../utils/MessageUtils'
import { DEV_ID, NOT_FOUND_INDEX } from '../../../utils/values/consts'
import { CallbackButtonContext } from '../../../utils/values/types/contexts'
import IdeasService from '../../db/services/ideas/IdeasService'
import CallbackButtonAction from '../CallbackButtonAction'
import IdeaChangeAction from './IdeaChangeAction'
import ScrollerWithIdData from '../../../interfaces/callback-button-data/ScrollerWithIdData'
import { scrollerWithIdDataSchema } from '../../../utils/values/schemas'
import FileUtils from '../../../utils/FileUtils'
import { CallbackButtonOptions } from '../../../utils/values/types/action-options'

export default class DeleteIdeaAction extends CallbackButtonAction<ScrollerWithIdData> {
    protected _schema: ZodType<ScrollerWithIdData> = scrollerWithIdDataSchema

    constructor () {
        super()
        this._name = 'deleteidea'
    }

    async execute({ ctx, data }: CallbackButtonOptions<ScrollerWithIdData>): Promise<string | void> {
        const { current, id } = data
        const ideas = await IdeasService.getIdeas()
        const idea = ideas[current]

        if (!idea) {
            return await FileUtils.readPugFromResource(
                'text/actions/idea/no-idea.pug'
            )
        }
        else {
            const {
                id: owner
            } = idea
            if (id !== DEV_ID && id !== owner) {
                return await FileUtils.readPugFromResource('text/actions/idea/no-dev.pug')
            }
            await IdeasService.delete(current)

            const newIdeas = await IdeasService.getIdeas()
            const newPage = ArrayUtils.getNearIndex(current, newIdeas)

            if (newPage != NOT_FOUND_INDEX) {
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