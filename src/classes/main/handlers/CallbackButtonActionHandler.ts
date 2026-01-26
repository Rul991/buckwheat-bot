import BaseHandler from './BaseHandler'
import Logging from '../../../utils/Logging'
import CallbackButtonAction from '../../callback-button/CallbackButtonAction'
import ContextUtils from '../../../utils/ContextUtils'
import FileUtils from '../../../utils/FileUtils'
import { MyTelegraf } from '../../../utils/values/types/types'
import LinkedChatService from '../../db/services/linkedChat/LinkedChatService'
import { CallbackButtonOptions } from '../../../utils/values/types/action-options'
import { BUTTON_ACCESS_TYPE, DATABASE_KEYBOARD_NAME } from '../../../utils/values/consts'
import ObjectValidator from '../../../utils/ObjectValidator'
import JsonUtils from '../../../utils/JsonUtils'
import { keyboardDbDataSchema } from '../../../utils/values/schemas'
import KeyboardService from '../../db/services/keyboard/KeyboardService'
import MapContainer from '../containers/MapContainer'
import Setting from '../../../interfaces/other/Setting'
import SettingUtils from '../../../utils/settings/SettingUtils'
import ButtonAccessService from '../../db/services/settings/access/ButtonAccessService'
import RateLimitUtils from '../../../utils/ratelimit/RateLimitUtils'

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
        const {
            isPrivate
        } = options

        const canUse = (isPrivate && action.canBeUseInPrivateWithoutRank) ||
            action.buttonTitle === undefined ||
            await ButtonAccessService.canUse({
                ...options,
                settingId: action.settingId,
                command: {
                    command: action.buttonTitle,
                    isFull: true
                },
                path: 'text/handlers/callback/low-rank.pug',
                info: async (ctx, text) => {
                    await ContextUtils.showCallbackMessage(
                        ctx,
                        text,
                        true
                    )
                }
            })

        if (!canUse) return undefined
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

    protected _setupSettings() {
        const settings = {} as Record<string, Setting<'enum'>>

        for (const action of this._container) {
            const actionSettings = action.actionAccesses
            for (const actionSetting of actionSettings) {
                const { name, setting } = actionSetting
                settings[name] = setting
            }
        }

        SettingUtils.addSettings(BUTTON_ACCESS_TYPE, settings)
    }

    setup(bot: MyTelegraf): void {
        this._setupSettings()
        bot.action(/^([^_]+)_(.+)$/, async ctx => {
            const id = ctx.from.id
            let [_, name, rawData] = ctx.match
            
            if (!name) return
            if (RateLimitUtils.isLimit(id)) return

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

            Logging.system(
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

                const isPrivate = ctx.chat?.type == 'private'
                const text = chatId ? await this._executeAction(action, {
                    ctx,
                    data,
                    id,
                    chatId,
                    isPrivate
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