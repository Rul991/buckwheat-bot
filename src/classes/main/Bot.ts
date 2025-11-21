import { session, Telegraf } from 'telegraf'
import Logging from '../../utils/Logging'
import { CHAT_ID, DOMAIN, HOOK_PORT, MODE, SECRET_PATH } from '../../utils/values/consts'
import FileUtils from '../../utils/FileUtils'
import BaseHandler from './handlers/BaseHandler'
import MessageUtils from '../../utils/MessageUtils'
import express from 'express'
import BaseAction from '../actions/base/BaseAction'

export default class Bot {    
    private _bot: Telegraf
    private _handlers: BaseHandler<any, any>[]

    constructor(token: string) {
        this._bot = new Telegraf(token)

        this._handlers = []
    }

    get bot(): Telegraf {
        return this._bot
    }

    addHandlers(...handlers: BaseHandler<any, any>[]): void {
        this._handlers.push(...handlers)
    }

    addActions(...actions: BaseAction[]): void {
        for (const action of actions) {
            for (const handler of this._handlers) {
                if(handler.isNeedType(action)) {
                    handler.add(action)
                    break
                }
            }
        }
    }

    private async _launchCallback(): Promise<void> {
        console.log(`Listened at https://t.me/${this._bot.botInfo?.username} (!)`)
        if(MODE == 'prod') {
            this._bot.telegram.sendMessage(
                CHAT_ID!, 
                await FileUtils.readPugFromResource('text/commands/update/after_restart.pug')
            )
        }
    }

    private async _startWebHook(callback = async () => {}) {
        const app = express()

        app.use(this._bot.webhookCallback(SECRET_PATH))
        this._bot.telegram.setWebhook(`${DOMAIN}${SECRET_PATH}`)

        app.listen(HOOK_PORT!, '0.0.0.0', 0, callback)
    }

    private async _startLongPolling(callback = async () => {}) {
        await this._bot.launch(
            {
                dropPendingUpdates: true
            }, 
            callback
        )
    }

    async launch(isWebHook = false, callback = async () => {}): Promise<void> {
        this._bot.use(session())

        this._handlers.forEach(handler => 
            handler.setup(this._bot)
        )

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

        if(isWebHook) {
            this._startWebHook(launchCallback)
        }
        else {
            this._startLongPolling(launchCallback)
        }
    }
}