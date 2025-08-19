import Idea from '../../../interfaces/schemas/Idea'
import { PARSE_MODE } from '../../../utils/consts'
import ContextUtils from '../../../utils/ContextUtils'
import FileUtils from '../../../utils/FileUtils'
import MessageUtils from '../../../utils/MessageUtils'
import Pager from '../../../utils/Pager'
import { CallbackButtonContext } from '../../../utils/types'
import IdeasService from '../../db/services/ideas/IdeasService'
import InlineKeyboardManager from '../../main/InlineKeyboardManager'
import CallbackButtonAction from '../CallbackButtonAction'

export default class IdeaChangeAction extends CallbackButtonAction {
    constructor() {
        super()
        this._name = 'ideachange'
    }

    static async editMessage(ctx: CallbackButtonContext, {name, text, coolVote, badVote}: Idea, pagesLength: number, newPage: number, id: number) {
        await MessageUtils.editText(
            ctx,
            await FileUtils.readPugFromResource(
                'text/commands/ideas/idea.pug',
                {
                    changeValues: {
                        name: name,
                        text: text,
                        currentPage: newPage,
                        pagesLength,
                        coolVote,
                        badVote
                    }
                }
            ),
            {
                reply_markup: {
                    inline_keyboard: await InlineKeyboardManager.get('ideachange', `${newPage}_${id}`)
                },
                parse_mode: PARSE_MODE
            }
        )
    }

    async execute(ctx: CallbackButtonContext, data: string): Promise<string | void> {
        const ideas = await IdeasService.getIdeas()
        const newPage = Pager.clampPages(data, ideas.length)
        const userId = +(data.split('_')[2])

        if(userId !== ctx.from.id) {
            await ContextUtils.showAlert(ctx)
            return
        }
        if(!ideas[newPage]) return 'Идей нет!'
        const idea = ideas[newPage]

        await IdeaChangeAction.editMessage(
            ctx,
            idea,
            ideas.length,
            newPage,
            userId
        )
    }
}