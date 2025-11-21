import ContextUtils from '../../../../utils/ContextUtils'
import MessageUtils from '../../../../utils/MessageUtils'
import { TextContext, MaybeString } from '../../../../utils/values/types'
import LinkedChatService from '../../../db/services/linkedChat/LinkedChatService'
import MarriageService from '../../../db/services/marriage/MarriageService'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default class DivorceCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'развестись'
        this._aliases = [
            'развод',
            'расстаться'
        ]
        this._description = 'выполняю услуги ЗАГСа'
    }

    async execute(ctx: TextContext, other: MaybeString): Promise<void> {
        const id = ctx.from.id
        const chatId = await LinkedChatService.getCurrent(ctx, id)
        if(!chatId) return

        const partnerId = (await MarriageService.get(chatId, id)).partnerId

        const isDivorced = Boolean(
            partnerId && await MarriageService.divorce(chatId, id, partnerId)
        )
        
        const changeValues = {
            user: await ContextUtils.getUser(chatId, id),
            reply: await ContextUtils.getUser(chatId, partnerId),
        }

        if(isDivorced) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/marriage/divorce/divorce.pug',
                {changeValues}
            )
        }
        else {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/marriage/divorce/not-equal.pug',
                {changeValues}
            )
        }
    }
}