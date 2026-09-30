import LinkedChatService from "../../../db/services/chat/LinkedChatService"
import SettingValueService from "../../../db/services/settings/SettingValueService"
import { autolinkSetting } from "../../../resources/settings/user"
import type { NewChatMemberActionOptions } from "../../../types/action-options"
import NewChatMemberAction from "../base/NewChatMemberAction"

export default class AutoLinkNewChatMemberAction extends NewChatMemberAction {
    override async execute(options: NewChatMemberActionOptions): Promise<void> {
        const {
            chatId,
            ctx
        } = options

        for (const user of ctx.msg.new_chat_members) {
            const id = user.id
            const autoLinkSettingValue = await SettingValueService.get({
                id,
                setting: autolinkSetting
            })

            const isAutoLink = autoLinkSettingValue.value
            if (!isAutoLink) continue

            await LinkedChatService.set(
                id,
                chatId
            )
        }
    }
}