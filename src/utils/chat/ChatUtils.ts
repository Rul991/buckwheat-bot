import { chatKeyboard } from "../../bot/keyboards/chat"
import type Chat from "../../db/entities/chat/Chat"
import RuleService from "../../db/services/chat/RuleService"
import type { BotContext } from "../../types/bot"

export default class ChatUtils {
    static async message(ctx: BotContext, chat: Chat) {
        return {
            key: 'chat/info',
            options: {
                vars: {
                    chat,
                    ruleCount: await RuleService.count(chat.id)
                },
                keyboard: await chatKeyboard(ctx, {})
            }
        } as const
    }
}