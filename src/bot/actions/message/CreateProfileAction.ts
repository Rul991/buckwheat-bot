import UserService from "../../../db/services/user/UserService"
import type { MessageActionOptions } from "../../../types/action-options"
import type { ChatTypes } from "../../../types/types"
import MessageAction from "../base/MessageAction"

export default class CreateProfileAction extends MessageAction {
    override chatTypes: ChatTypes[] = ['chat']
    
    override async execute(options: MessageActionOptions): Promise<boolean | void> {
        const {
            chatId,
            id,
            ctx
        } = options
        if(ctx.vars.user) return
        if(!chatId) return

        ctx.vars.user = await UserService.defaultCreate(
            chatId,
            id,
            ctx.from
        )
    }
}