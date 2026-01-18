import { Telegraf } from 'telegraf'
import { session } from 'telegraf/session'
import Logging from '../../utils/Logging'
import { CHAT_ID, DOMAIN, HOOK_PORT, MILLISECONDS_IN_SECOND, MODE, SECRET_PATH, HTTP_PROXY } from '../../utils/values/consts'
import FileUtils from '../../utils/FileUtils'
import BaseHandler from './handlers/BaseHandler'
import MessageUtils from '../../utils/MessageUtils'
import express from 'express'
import BaseAction from '../actions/base/BaseAction'
import { MyTelegraf } from '../../utils/values/types/types'
import PQueue from 'p-queue'
import { HttpsProxyAgent } from 'https-proxy-agent'

export default class Bot {
    private _bot: MyTelegraf
    private _handlers: BaseHandler<any, any>[]

    private readonly _maxRequests: number = 10
    private readonly _concurrency: number = this._maxRequests
    private readonly _queue = new PQueue({
        concurrency: this._concurrency,
        interval: MILLISECONDS_IN_SECOND / this._maxRequests,
        intervalCap: this._maxRequests,
        autoStart: true
    })

    constructor (token: string) {
        this._bot = new Telegraf(
            token,
            {
                telegram: {
                    agent: HTTP_PROXY ? new HttpsProxyAgent(HTTP_PROXY) : undefined
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
            this._bot.telegram.sendMessage(
                CHAT_ID!,
                await FileUtils.readPugFromResource('text/commands/update/after_restart.pug')
            )
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
        this._bot.use(async (_ctx, next) => {
            await this._queue.add(async _options => {
                await next()
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

        const launchCallback = async () => {
            this._launchCallback()
            await callback()
        }

        if (isWebHook) {
            this._startWebHook(launchCallback)
        }
        else {
            this._startLongPolling(launchCallback)
        }
    }
}