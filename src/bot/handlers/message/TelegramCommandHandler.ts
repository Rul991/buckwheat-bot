import type { BotCommand, LanguageCode } from "grammy/types"
import type { MyBot } from "../../../types/bot"
import MessageUtils from "../../../utils/bot/MessageUtils"
import type TelegramCommand from "../../actions/base/TelegramCommand"
import BaseHandler from "../base/BaseHandler"
import { IS_PROD } from "../../../consts/env"
import Logger from "../../../utils/logs/Logger"

export default class TelegramCommandHandler extends BaseHandler<TelegramCommand> {
    override async setup(bot: MyBot): Promise<void> {
        if (IS_PROD) {
            let isUsedFirstLikeDefault = false
            const langs = bot.i18n.availableLanguages
                .filter(v => v.length == 2 || v.length == 3)

            for (const lang of langs) {
                const botCommands: BotCommand[] = this._container.values()
                    .filter(v => v.isShow)
                    .map(
                        action => {
                            const commandDescription = action.commandDescription
                            const descriptionKey = commandDescription.description
                            const compileFunction = bot.i18n
                                .locales[descriptionKey]
                                ?.[lang]
                            if (!compileFunction) return null

                            const result = {
                                command: commandDescription.name,
                                description: compileFunction()
                            }
                            Logger.log('TelegramCommandHandler.setup (bot command)', result)

                            return result
                        }
                    )
                    .filter(v => v !== null)
                    .toArray()

                await bot.api.setMyCommands(
                    botCommands,
                    {
                        language_code: lang as LanguageCode
                    }
                )

                if (!isUsedFirstLikeDefault) {
                    isUsedFirstLikeDefault = true
                    await bot.api.setMyCommands(
                        botCommands
                    )
                }
            }

            Logger.log(
                'TelegramCommandHandler.setup (set my commands)',
                {
                    commands: await bot.api.getMyCommands(),
                    langs,
                    i18n: bot.i18n
                }
            )
        }

        for (const [name, action] of this._container) {
            bot.command(
                name,
                async (ctx, next) => {
                    if (!(ctx.vars.id && ctx.vars.chatId)) return
                    if (!ctx.from) return

                    const result = await action.execute({
                        commandStrings: [`/${name}`, ctx.match, ctx.match],
                        id: ctx.vars.id,
                        chatId: ctx.vars.chatId,
                        ctx: ctx as any,
                        replyOrUserFrom: ctx.from,
                        other: ctx.match
                    })
                    if (result) {
                        const {
                            key,
                            options
                        } = result

                        await MessageUtils.reply(
                            ctx,
                            key,
                            options
                        )
                    }

                    return next()
                }
            )
        }
    }
}