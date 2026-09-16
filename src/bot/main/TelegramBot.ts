import { Bot } from "grammy"
import type { MyBot } from "../../types/bot"
import { BASE_URL, BOT_TOKEN, CHAT_ID, DEV_ID, IS_DEV, IS_PROD } from "../../consts/env"
import type BaseHandler from "../handlers/base/BaseHandler"
import type BaseAction from "../actions/base/BaseAction"
import Logger from "../../utils/logs/Logger"
import MessageUtils from "../../utils/bot/MessageUtils"
import i18n from "@grully/i18n"
import i18nPug from "@grully/i18n-pug"
import { autoRetry } from "@grammyjs/auto-retry"
import { limit } from '@grammyjs/ratelimiter'
import { START_MESSAGE } from "../../consts/texts"
import { conversations } from "@grammyjs/conversations"
import { updateDefaultOptions } from "../middlewares/middlewares"
import { MILLISECONDS_IN_SECOND, SECONDS_IN_MINUTE } from "../../consts/time"
import CommandUtils from "../../utils/command/CommandUtils"
import TotalService from "../../db/services/base/TotalService"

export default class TelegramBot {
    private _bot: MyBot
    private _handlers: BaseHandler<BaseAction>[]

    constructor() {
        this._bot = new Bot(
            BOT_TOKEN,
            {
                client: {
                    apiRoot: BASE_URL
                }
            }
        )
        this._handlers = []
    }

    add(...handlers: BaseHandler<BaseAction>[]) {
        this._handlers.push(...handlers)
    }

    private async _setupMiddlewares() {
        this._bot.use(
            limit({
                keyGenerator(ctx) {
                    const commandStrings = ctx.msg?.text ?
                        CommandUtils.getCommandStrings(ctx.msg.text ?? '') :
                        undefined
                        
                    ctx.vars = {
                        ...ctx.vars,
                        commandStrings
                    }
                    
                    const notLimited = Boolean(!ctx.update.callback_query && !commandStrings)
                    if(notLimited) {
                        return Math.random().toString(16)
                    }

                    return ctx.chatId?.toString() ?? ''
                },
                limit: 3,
                timeFrame: MILLISECONDS_IN_SECOND * 3,
            })
        )

        this._bot.use(
            i18n({
                folder: 'locales',
                defaultLocale: 'ru',
                isDebug: IS_DEV,
                plugin: i18nPug({
                    debug: false,
                }),
                needCache: IS_PROD,
            })
        )

        this._bot.use(async (ctx, next) => {
            await updateDefaultOptions(ctx)
            return await next()
        })

        this._bot.use(conversations({
            onEnter(id, ctx) {
                Logger.system('conversations.onEnter', id, ctx.chat, ctx.from, ctx.message)
            },
            onExit(id, ctx) {
                Logger.system('conversations.onExit', id, ctx.chat, ctx.from, ctx.message)
            },
        }))

        this._bot.on(
            [':migrate_from_chat_id'],
            async (ctx, next) => {
                const oldChatId = ctx.msg.migrate_from_chat_id
                const newChatId = ctx.msg.migrate_to_chat_id
                if(!newChatId) return await next()

                await TotalService.migrate(
                    oldChatId,
                    newChatId
                )
                return await next()
            }
        )
    }

    private async _setupTransformers() {
        this._bot.api.config.use(autoRetry({
            maxDelaySeconds: SECONDS_IN_MINUTE * 3,
            maxRetryAttempts: 5,
            rethrowHttpErrors: true,
            rethrowInternalServerErrors: true
        }))
    }

    private async _setupHandlers() {
        for (const handler of this._handlers) {
            await handler.setup(this._bot)
        }
    }

    private async _setup() {
        await this._setupMiddlewares()
        await this._setupHandlers()
        await this._setupTransformers()
        await this._catch()
    }

    private async _catch() {
        this._bot.catch(async e => {
            const {
                ctx
            } = e

            Logger.error('bot.catch', e)
            await Promise.all([
                MessageUtils.reply(
                    ctx,
                    'error/catch/dev',
                    {
                        chatId: DEV_ID,
                        vars: {
                            error: e,
                            chat: ctx.chat,
                            message: ctx.msg,
                            user: ctx.from
                        }
                    }
                ),
                MessageUtils.reply(
                    ctx,
                    'error/catch/user'
                )
            ])
        })
    }

    async run() {
        await this._setup()

        return this._bot.start({
            drop_pending_updates: IS_PROD,
            onStart: async (botInfo) => {
                Logger.log(botInfo)
                if (IS_DEV) return

                try {
                    this._bot.api.sendMessage(
                        CHAT_ID,
                        START_MESSAGE
                    )
                }
                catch (e) {
                    Logger.error('bot.onStart', e)
                }
            },
        })
    }
}