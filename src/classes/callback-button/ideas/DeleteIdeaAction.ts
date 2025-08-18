import ArrayUtils from '../../../utils/ArrayUtils'
import { DEV_ID } from '../../../utils/consts'
import { CallbackButtonContext } from '../../../utils/types'
import IdeasService from '../../db/services/ideas/IdeasService'
import CallbackButtonAction from '../CallbackButtonAction'
import IdeaChangeAction from './IdeaChangeAction'

export default class DeleteIdeaAction extends CallbackButtonAction {
    constructor() {
        super()
        this._name = 'deleteidea'
    }

    async execute(ctx: CallbackButtonContext, data: string): Promise<string | void> {
        if(ctx.from.id !== DEV_ID) return 'Ты не разработчик!'

        const page = +data
        const ideas = await IdeasService.getIdeas()
        
        if(!ideas[page]) return 'Такой идеи нет!'
        else {
            await IdeasService.delete(page)
            
            const newIdeas = await IdeasService.getIdeas()
            const newPage = ArrayUtils.getNearIndex(page, newIdeas)

            if(newPage != -1) {
                await IdeaChangeAction.editMessage(
                    ctx,
                    newIdeas[newPage],
                    newIdeas.length,
                    newPage
                )
            }
            
            return `Идея #${page + 1} удалена!`
        }
    }
}