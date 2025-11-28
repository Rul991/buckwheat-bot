import { JSONSchemaType } from 'ajv'
import { CallbackButtonContext } from '../../../utils/values/types/types'
import CallbackButtonAction from '../CallbackButtonAction'
import RankUtils from '../../../utils/RankUtils'
import ContextUtils from '../../../utils/ContextUtils'
import UserRankService from '../../db/services/user/UserRankService'
import FileUtils from '../../../utils/FileUtils'
import LinkedChatService from '../../db/services/linkedChat/LinkedChatService'
import { SET_NUMBER_PHRASE, SET_STRING_PHRASE } from '../../../utils/values/consts'
import ChatSettingsService from '../../db/services/settings/ChatSettingsService'
import StringUtils from '../../../utils/StringUtils'
import SettingShowUtils from '../../../utils/settings/SettingShowUtils'

type Data = {
    id: number
    n: string
    v: boolean | number | string
    p?: number
}

export default class extends CallbackButtonAction<Data> {
    protected _schema: JSONSchemaType<Data> = {
        type: 'object',
        properties: {
            id: {
                type: 'number'
            },
            n: {
                type: 'string'
            },
            v: {
                type: [
                    'boolean',
                    'number',
                    'string'
                ]
            },
            p: {
                type: 'number',
                nullable: true
            }
        },
        required: ['id', 'n', 'v']
    }
    protected _minimumRank: number = RankUtils.max

    constructor() {
        super()
        this._name = 'set'
    }

    async execute(ctx: CallbackButtonContext, data: Data): Promise<string | void> {
        const {
            id,
            n: settingId,
            v: value,
            p: page
        } = data

        if(await ContextUtils.showAlertIfIdNotEqual(ctx, id)) return

        const chatId = await LinkedChatService.getCurrent(ctx, id)
        if(!chatId) return await FileUtils.readPugFromResource('text/actions/other/no-chat-id.pug')

        if(!await UserRankService.has(chatId, id, this._minimumRank)) {
            return await FileUtils.readPugFromResource(
                'text/other/rank-issue.pug',
                {
                    changeValues: {
                        rank: this._minimumRank
                    }
                }
            )
        }

        const initialState = {
            settingId,
            chatId
        }

        if(value == SET_NUMBER_PHRASE) {
            await ctx.scene.enter(
                'setting-number',
                initialState
            )
        }
        else if(value == SET_STRING_PHRASE) {
            await ctx.scene.enter(
                'setting-string',
                initialState
            )
        }
        else {
            await ChatSettingsService.set(chatId, settingId, value)

            await SettingShowUtils.editMessage({
                chatId,
                id,
                settingId,
                ctx,
                page
            })

            return await FileUtils.readPugFromResource(
                'text/commands/settings/set-value.pug',
                {
                    changeValues: {
                        value: StringUtils.getShowValue(value)
                    }
                }
            )
        }
    }
}