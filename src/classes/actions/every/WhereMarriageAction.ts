import { WHERE_MARRIAGE_MESSAGES, WHERE_MARRIAGE_TIME } from '../../../utils/values/consts'
import ContextUtils from '../../../utils/ContextUtils'
import MessageUtils from '../../../utils/MessageUtils'
import { MessageContext } from '../../../utils/values/types'
import EveryMessageAction from './EveryMessageAction'

export default class WhereMarriageAction extends EveryMessageAction {
    private static _words = [
        'свадьба',
        'когда'
    ]

    async execute(ctx: MessageContext): Promise<void | true> {
        const text = ctx.text?.toLowerCase()
        if(!text) return

        let usedWords = 0
        for (const word of WhereMarriageAction._words) {
            if(text.includes(word)) {
                usedWords++
            }
        }

        if(usedWords >= WhereMarriageAction._words.length) {
            let i = 0
            let interval = setInterval(async () => {
                if(i >= WHERE_MARRIAGE_MESSAGES) {
                    clearInterval(interval)
                    return
                }
                await MessageUtils.answerMessageFromResource(
                    ctx,
                    'text/actions/other/marriage.pug',
                    {
                        changeValues: await ContextUtils.getUser(ctx.from.id, ctx.from.first_name),
                        disableNotification: true
                    }
                )
                i++
            }, WHERE_MARRIAGE_TIME)
        }
    }
}