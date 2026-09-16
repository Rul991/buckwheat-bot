import type { AdminExecuteOptions } from "../../../../../types/options"
import MessageUtils from "../../../../../utils/bot/MessageUtils"
import AdminCommand from "./AdminCommand"

export default class DeleteCommand extends AdminCommand {
    protected override _showTime: boolean = false
    protected override _canUseOnSelf: boolean = true

    override aliases: string[] = ['удали']
    override name: string = 'удалить'
    override filename: string = 'delete'
    override settingId: number = 28
    
    protected override async _execute(options: AdminExecuteOptions): Promise<boolean> {
        const {
            ctx,
        } = options

        const replyMessageId = ctx.msg.reply_to_message?.message_id
        if(!replyMessageId) {
            return false
        }

        return await MessageUtils.deleteMessages(ctx, replyMessageId)
    }
}