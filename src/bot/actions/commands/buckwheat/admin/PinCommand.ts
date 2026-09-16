import type { AdminExecuteOptions } from "../../../../../types/options"
import MessageUtils from "../../../../../utils/bot/MessageUtils"
import AdminCommand from "./AdminCommand"

export default class PinCommand extends AdminCommand {
    protected override _showTime: boolean = false
    protected override _canUseOnSelf: boolean = true

    override aliases: string[] = ['закреп', 'пин']
    override name: string = 'закрепить'
    override filename: string = 'pin'
    override settingId: number = 29
    
    protected override async _execute(options: AdminExecuteOptions): Promise<boolean> {
        const {
            ctx,
        } = options

        const replyMessageId = ctx.msg.reply_to_message?.message_id
        if(!replyMessageId) {
            return false
        }

        return await MessageUtils.pin(ctx, replyMessageId)
    }
}