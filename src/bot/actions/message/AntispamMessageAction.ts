import AntispamService from "../../../db/services/antispam/AntispamService"
import SettingValueService from "../../../db/services/settings/SettingValueService"
import { antispamMuteSetting } from "../../../resources/settings/chat"
import type { MessageActionOptions } from "../../../types/action-options"
import type { ChatTypes } from "../../../types/unions"
import AdminUtils from "../../../utils/bot/AdminUtils"
import ContextUtils from "../../../utils/bot/ContextUtils"
import MessageUtils from "../../../utils/bot/MessageUtils"
import MessageAction from "../base/MessageAction"

export default class AntispamMessageAction extends MessageAction {
    override chatTypes: ChatTypes[] = ['chat']

    override async execute(options: MessageActionOptions): Promise<boolean | void> {
        const {
            ctx,
            chatId,
            id
        } = options

        const chatMember = await ctx.vars.chatMember.get()
        const hasStatus = ContextUtils.hasStatusByChatMember(
            chatMember,
            ['administrator', 'creator']
        ) ?? false
        if (hasStatus) return true
        if (!chatId) return false

        const isMuted = await AntispamService.addAndCheck(chatId, id)
        if (!isMuted) return true

        const muteTimeSettingValue = await SettingValueService.get({
            id: chatId,
            setting: antispamMuteSetting
        })
        const muteTime = muteTimeSettingValue.value

        await Promise.all([
            MessageUtils.reply(
                ctx,
                'antispam/mute',
                {
                    vars: {
                        user: await ctx.vars.user.get()
                    }
                }
            ),
            AdminUtils.mute(
                ctx,
                id,
                muteTime
            )
        ])
        return false
    }
}