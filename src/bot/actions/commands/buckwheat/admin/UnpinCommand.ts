import type { AdminExecuteOptions } from "../../../../../types/options"
import MessageUtils from "../../../../../utils/bot/MessageUtils"
import AdminCommand from "./AdminCommand"

export default class UnpinCommand extends AdminCommand {
    protected override _showTime: boolean = false
    protected override _canUseOnSelf: boolean = true

    override aliases: string[] = ['откреп', 'анпин']
    override name: string = 'открепить'
    override filename: string = 'unpin'
    override settingId: number = 30
    
    protected override async _execute(options: AdminExecuteOptions): Promise<boolean> {
        const {
            ctx,
        } = options

        const replyMessageId = ctx.msg.reply_to_message?.message_id
        if(!replyMessageId) {
            return false
        }

        return await MessageUtils.unpin(ctx, replyMessageId)
    }
}