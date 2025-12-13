import MessageUtils from '../../../utils/MessageUtils'
import StringUtils from '../../../utils/StringUtils'
import { NewMemberContext } from '../../../utils/values/types/types'
import CasinoGetService from '../../db/services/casino/CasinoGetService'
import LinkedChatService from '../../db/services/linkedChat/LinkedChatService'
import UserOldService from '../../db/services/user/UserOldService'
import NewMemberAction from './NewMemberAction'

export default class extends NewMemberAction {
    async execute(ctx: NewMemberContext): Promise<void> {
        const chatId = ctx.chat.id
        for (const member of ctx.message.new_chat_members) {
            const isOld = await UserOldService.get(chatId, member.id)
            if(!isOld) continue

            const money = await CasinoGetService.money(chatId, member.id)
            if(money < 0) {
                await MessageUtils.answerMessageFromResource(
                    ctx,
                    'text/new-member/debt-enter.pug',
                    {
                        changeValues: {
                            money: StringUtils.toFormattedNumber(money)
                        }
                    }
                )
            }
            else {
                await MessageUtils.answerMessageFromResource(
                    ctx,
                    'text/new-member/return.pug'
                )
            }
        }
    }
}