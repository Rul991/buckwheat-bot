import { JSONSchemaType } from 'ajv'
import ScrollerWithIdData from '../../../interfaces/callback-button-data/ScrollerWithIdData'
import Idea from '../../../interfaces/schemas/ideas/Idea'
import ContextUtils from '../../../utils/ContextUtils'
import FileUtils from '../../../utils/FileUtils'
import IdeaUtils from '../../../utils/IdeaUtils'
import MessageUtils from '../../../utils/MessageUtils'
import Pager from '../../../utils/Pager'
import { CallbackButtonContext } from '../../../utils/values/types/types'
import IdeasService from '../../db/services/ideas/IdeasService'
import InlineKeyboardManager from '../../main/InlineKeyboardManager'
import CallbackButtonAction from '../CallbackButtonAction'
import { scrollerWithIdDataSchema } from '../../../utils/values/schemas'
import TimeUtils from '../../../utils/TimeUtils'
import { DEV_ID, MODE } from '../../../utils/values/consts'

export default class IdeaChangeAction extends CallbackButtonAction<ScrollerWithIdData> {
    protected _schema: JSONSchemaType<ScrollerWithIdData> = scrollerWithIdDataSchema

    constructor() {
        super()
        this._name = 'ideachange'
    }

    static async editMessage(
        ctx: CallbackButtonContext, 
        {name, text, coolVote, badVote, createdAtTime}: Idea, 
        pagesLength: number, 
        newPage: number, 
        id: number
    ) {
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
                        badVote,
                        canVote: IdeaUtils.canVote(createdAtTime!),
                        date: TimeUtils.formatMillisecondsToTime(
                            TimeUtils.getElapsed(createdAtTime ?? 0)
                        )
                    }
                }
            ),
            {
                reply_markup: {
                    inline_keyboard: await InlineKeyboardManager.get(
                        'ideachange', 
                        JSON.stringify({id, current: newPage})
                    )
                },
            }
        )
    }

    async execute(ctx: CallbackButtonContext, data: ScrollerWithIdData): Promise<string | void> {
        const {id, current, increase} = data
        if(MODE == 'dev' && id != DEV_ID) return 
            await FileUtils.readPugFromResource('text/actions/idea/no-dev.pug')

        const ideas = await IdeasService.getIdeas()
        const newPage = Pager.wrapPages(`${increase}_${current}_${id}`, ideas.length)

        if(await ContextUtils.showAlertIfIdNotEqual(ctx, id)) return 
        if(!ideas[newPage]) return await FileUtils.readPugFromResource('text/actions/idea/no-idea.pug')
        const idea = ideas[newPage]

        await IdeaChangeAction.editMessage(
            ctx,
            idea,
            ideas.length,
            newPage,
            id
        )
    }
}