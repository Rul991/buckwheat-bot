import type { GrullyI18nVars } from "@grully/i18n"
import type { BotContext } from "../../types/bot"
import ExceptionUtils from "../exceptions/ExceptionUtils"

export default class AlertUtils {
    static async show(ctx: BotContext, key?: string, vars?: GrullyI18nVars, isAlert?: boolean): Promise<boolean> {
        return await ExceptionUtils.handleAsync(
            async () => {
                return await ctx.answerCallbackQuery({
                    show_alert: isAlert,
                    text: key && ctx.t(key, vars),
                })
            },
            false
        )
    }

    static async alert(ctx: BotContext, key: string, vars?: GrullyI18nVars): Promise<boolean> {
        return await this.show(
            ctx,
            key,
            vars,
            true
        )
    }
}