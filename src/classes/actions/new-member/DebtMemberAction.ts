import MessageUtils from '../../../utils/MessageUtils'
import { NewMemberContext } from '../../../utils/values/types'
import CasinoGetService from '../../db/services/casino/CasinoGetService'
import NewMemberAction from './NewMemberAction'

export default class DebtMemberAction extends NewMemberAction {
    async execute(ctx: NewMemberContext): Promise<void> {
        const chatId = ctx.chat.id
        for (const member of ctx.message.new_chat_members) {
            const money = await CasinoGetService.getMoney(chatId, member.id)
            if(money < 0) {
                await MessageUtils.answerMessageFromResource(
                    ctx,
                    'text/new-member/debt-enter.pug',
                    {
                        changeValues: {
                            money
                        }
                    }
                )
            }
        }
    }
}