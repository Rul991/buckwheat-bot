import { Context } from 'telegraf'
import { BaseScene } from 'telegraf/scenes'
import { Update } from 'telegraf/types'
import { AsyncOrSync, SceneContextData } from '../../../utils/values/types/types'
import SceneAction from './SceneAction'
import MessageUtils from '../../../utils/MessageUtils'
import StringUtils from '../../../utils/StringUtils'
import ChatSettingsService from '../../db/services/settings/ChatSettingsService'
import SettingUtils from '../../../utils/settings/SettingUtils'
import Setting from '../../../interfaces/other/Setting'
import MathUtils from '../../../utils/MathUtils'
import { INFINITY_SYMB } from '../../../utils/values/consts'

type Data = {
    settingId: string
    chatId: number
    setting?: Setting<'number'>
}

export default class extends SceneAction<Data> {
    constructor () {
        super()
        this._name = 'setting-number'
    }

    protected _execute(scene: BaseScene<Context<Update> & SceneContextData<Data>>): AsyncOrSync {
        const getSetting = async (key: string) => {
            return await SettingUtils.getSetting<'number'>(
                'chat',
                key
            )
        }

        scene.enter(async ctx => {
            const {
                state
            } = ctx.scene
            const {
                settingId
            } = state

            await MessageUtils.deleteMessage(ctx)

            const setting = await getSetting(settingId)
            if (!setting) {
                await MessageUtils.answerMessageFromResource(
                    ctx,
                    'text/commands/settings/no-setting.pug',
                    {
                        isReply: false
                    }
                )
                await ctx.scene.leave()
                return
            }

            state.setting = setting

            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/scenes/setting-number/enter.pug',
                {
                    isReply: false,
                    changeValues: {
                        infinitySymbol: INFINITY_SYMB,
                        ...setting.properties
                    }
                }
            )
        })

        scene.on('text', async ctx => {
            const text = ctx.message.text
            const rawNumber = StringUtils.getNumberFromString(text)

            const {
                setting: rawSetting,
                chatId = 0,
                settingId = ''
            } = ctx.scene.state

            const setting = rawSetting!

            const {
                properties = {},
                title,
            } = setting

            const {
                min = Number.MIN_SAFE_INTEGER,
                max = Number.MAX_SAFE_INTEGER
            } = properties

            const value = MathUtils.clamp(
                rawNumber,
                min,
                max
            )

            await ChatSettingsService.set(
                chatId,
                settingId,
                value
            )

            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/scenes/setting-number/saved.pug',
                {
                    changeValues: {
                        title,
                        value: StringUtils.toFormattedNumber(value)
                    }
                }
            )
            await ctx.scene.leave()
        })
    }
}