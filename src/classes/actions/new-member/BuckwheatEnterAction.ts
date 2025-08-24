import MessageUtils from '../../../utils/MessageUtils'
import { NewMemberContext } from '../../../utils/values/types'
import NewMemberAction from './NewMemberAction'

export default class BuckwheatEnterAction extends NewMemberAction {
    async execute(ctx: NewMemberContext): Promise<void> {
        if(ctx.chat.type == 'private') return
        
        for (const member of ctx.message.new_chat_members) {
            if(member.id != ctx.botInfo.id) continue

            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/new-member/buckwheat-enter.pug',
                {
                    changeValues: {
                        id: ctx.chat.id
                    }
                }
            )
        }
    }
}