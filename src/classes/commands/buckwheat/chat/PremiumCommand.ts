import MessageUtils from '../../../../utils/MessageUtils'
import { TextContext, MaybeString } from '../../../../utils/values/types'
import LinkedChatService from '../../../db/services/linkedChat/LinkedChatService'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default class PremiumCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'премиум'
        this._description = 'продаю вам премиум для чата'
        this._needData = true
        this._argumentText = 'кол-во месяцев'
    }

    async execute(ctx: TextContext, other: MaybeString): Promise<void> {
        const months = +(other ?? '1')

        const id = ctx.from.id
        const chatId = await LinkedChatService.getCurrent(ctx, id)
        if(!chatId) return

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/chat/buy.pug',
            {
                inlineKeyboard: [
                    [
                        {
                            pay: true,
                            text: 'goyda',
                            
                        }
                    ]
                ]
            }
        )
    }
}