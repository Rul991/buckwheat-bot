import BaseHandler from './BaseHandler'
import Logging from '../../../utils/Logging'
import CallbackButtonAction from '../../callback-button/CallbackButtonAction'
import ContextUtils from '../../../utils/ContextUtils'
import FileUtils from '../../../utils/FileUtils'
import { MyTelegraf } from '../../../utils/values/types/types'
import LinkedChatService from '../../db/services/linkedChat/LinkedChatService'
import { CallbackButtonOptions } from '../../../utils/values/types/action-options'
import { DATABASE_KEYBOARD_NAME } from '../../../utils/values/consts'
import ObjectValidator from '../../../utils/ObjectValidator'
import JsonUtils from '../../../utils/JsonUtils'
import { keyboardDbDataSchema } from '../../../utils/values/schemas'
import KeyboardService from '../../db/services/keyboard/KeyboardService'
import MapContainer from '../containers/MapContainer'

type GetDataOptions = {
    data: string
    name: string
    chatId: number
}

export default class CallbackButtonActionHandler extends BaseHandler<
    CallbackButtonAction<unknown>,
    MapContainer<CallbackButtonAction<unknown>>
> {

    constructor () {
        super(new MapContainer())
    }

    private async _executeAction(action: CallbackButtonAction<any>, options: CallbackButtonOptions<any>) {
        return await action.execute(options) ?? undefined
    }

    private async _handleRawData({
        data,
        name,
        chatId
    }: GetDataOptions): Promise<string | null> {
        if (name != DATABASE_KEYBOARD_NAME) {
            return `${name}_${data}`
        }

        const json = JsonUtils.parse(data)
        if (!ObjectValidator.isValidatedObject(json, keyboardDbDataSchema)) {
            return null
        }

        const {
            id,
            msgId: messageId,
            pos: [x, y]
        } = json

        const keyboard = await KeyboardService.get({
            id,
            messageId,
            chatId
        })
        if (!keyboard) {
            return null
        }

        const result = keyboard.keyboard[y][x]
        if (!result) {
            return null
        }

        return result
    }

    setup(bot: MyTelegraf): void {
        bot.action(/^([^_]+)_(.+)$/, async ctx => {
            let [_, name, rawData] = ctx.match
            if (!name) return

            const id = ctx.from.id
            const rawHandledData = await this._handleRawData({
                data: rawData,
                name,
                chatId: ctx.chat?.id ?? id
            })

            if (!rawHandledData) {
                const text = await FileUtils.readPugFromResource(
                    'text/actions/callback-button/cant-parse-db-button.pug'
                )
                await ctx.answerCbQuery(text)
                return
            }

            const [newName, ...handledRawDatas] = rawHandledData.split('_')
            const handledRawData = handledRawDatas.join('_')

            Logging.log(
                'button:',
                {
                    name, 
                    rawData, 
                    id,
                    newName,
                    handledRawData,
                    handledRawDatas,
                    rawHandledData,
                    match: ctx.match
                }
            )

            const action = this._container.getByKey(newName)
            if (action) {
                const data = action.getData(handledRawData)

                if (action.schema && !action.isValid(data)) {
                    await ContextUtils.showCallbackMessage(
                        ctx,
                        await FileUtils.readPugFromResource(
                            'text/actions/callback-button/wrong-json.pug'
                        ),
                        true
                    )
                    return
                }

                const chatId = await LinkedChatService.getCurrent(ctx, id)
                if (!chatId) return

                const text = chatId ? await this._executeAction(action, {
                    ctx,
                    data,
                    id,
                    chatId
                }) : await FileUtils.readPugFromResource('text/actions/other/no-chat-id.pug')
                await ctx.answerCbQuery(text)
            }
            else {
                await ContextUtils.showCallbackMessage(
                    ctx,
                    await FileUtils.readPugFromResource(
                        'text/actions/callback-button/not-exist.pug'
                    ),
                    true
                )
            }
        })
    }
}