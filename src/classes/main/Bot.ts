import { Telegraf } from 'telegraf'
import { session } from 'telegraf/session'
import Logging from '../../utils/Logging'
import { CHAT_ID, DOMAIN, HOOK_PORT, KEEP_ALIVE_TIME, MODE, SECRET_PATH, SOCKS_PROXY } from '../../utils/values/consts'
import FileUtils from '../../utils/FileUtils'
import BaseHandler from './handlers/BaseHandler'
import MessageUtils from '../../utils/MessageUtils'
import express from 'express'
import { MyTelegraf } from '../../utils/values/types/types'
import QueueUtils from '../../utils/ratelimit/QueueUtils'
import { SocksProxyAgent } from 'socks-proxy-agent'

export default class Bot {
    private _bot: MyTelegraf
    private _handlers: BaseHandler<any, any>[]

    constructor (token: string) {
        this._bot = new Telegraf(
            token,
            {
                telegram: {
                    agent: SOCKS_PROXY ? new SocksProxyAgent(
                        SOCKS_PROXY,
                        {
                            keepAlive: true,
                            keepAliveMsecs: KEEP_ALIVE_TIME,
                        }
                    ) : undefined
                }
            }
        )

        this._handlers = []
    }

    get bot(): MyTelegraf {
        return this._bot
    }

    addHandlers(...handlers: BaseHandler<any, any>[]): void {
        this._handlers.push(...handlers)
    }

    private async _launchCallback(): Promise<void> {
        console.log(`Listened at https://t.me/${this._bot.botInfo?.username} (!)`)
        if (MODE == 'prod') {
            try {
                this._bot.telegram.sendMessage(
                    CHAT_ID!,
                    await FileUtils.readPugFromResource('text/commands/update/after_restart.pug')
                )
            }
            catch(e) {
                Logging.error('cant write good morning message!')
            }
        }
    }

    private async _startWebHook(callback = async () => { }) {
        const app = express()

        app.use(this._bot.webhookCallback(SECRET_PATH))
        this._bot.telegram.setWebhook(`${DOMAIN}${SECRET_PATH}`)

        app.listen(HOOK_PORT!, '0.0.0.0', 0, callback)
    }

    private async _startLongPolling(callback = async () => { }) {
        await this._bot.launch(
            {
                dropPendingUpdates: true,
            },
            callback
        )
    }

    async launch(isWebHook = false, callback = async () => { }): Promise<void> {
        this._bot.use(session())
        this._bot.use(async (ctx, next) => {
            await QueueUtils.add(async () => {
                return await next()
            })
        })

        for (const handler of this._handlers) {
            await handler.setup(this._bot)
        }

        this._bot.catch(async (e, ctx) => {
            Logging.error(e)
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/other/catch.pug',
                {
                    changeValues: {
                        error: e
                    }
                }
            )
        })

        const timeLogText = 'Launch time'
        const launchCallback = async () => {
            this._launchCallback()
            await callback()
            console.timeEnd(timeLogText)
        }

        console.time(timeLogText)
        if (isWebHook) {
            await this._startWebHook(launchCallback)
        }
        else {
            await this._startLongPolling(launchCallback)
        }
    }
}