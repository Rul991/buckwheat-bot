import ContextUtils from '../../../../utils/ContextUtils'
import MessageUtils from '../../../../utils/MessageUtils'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'
import MarriageService from '../../../db/services/marriage/MarriageService'
import InlineKeyboardManager from '../../../main/InlineKeyboardManager'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default class MarryCommand extends BuckwheatCommand {
    protected _settingId: string = 'marry'

    constructor() {
        super()
        this._name = 'пожениться'
        this._aliases = [
            'свадьба',
            'встречаться',
        ]
        this._replySupport = true
        this._description = 'выполняю услуги ЗАГСа'
    }

    async execute({ ctx, id: userId, chatId, replyOrUserFrom }: BuckwheatCommandOptions): Promise<void> {
        const replyId = replyOrUserFrom.id
        
        if(await MarriageService.hasPartner(chatId, userId)) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/marriage/married/user.pug',
                {
                    changeValues: {
                        ...await ContextUtils.getUser(chatId, userId)
                    }
                }
            )
            return
        }

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/marriage/marry/question.pug',
            {
                changeValues: {
                    user: await ContextUtils.getUser(chatId, userId),
                    reply: await ContextUtils.getUser(chatId, replyId),
                },
                inlineKeyboard: await InlineKeyboardManager.get('marry', JSON.stringify({
                    user: userId,
                    reply: replyId
                }))
            }
        )
    }
}