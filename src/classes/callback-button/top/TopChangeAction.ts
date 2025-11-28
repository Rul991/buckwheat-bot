import ContextUtils from '../../../utils/ContextUtils'
import FileUtils from '../../../utils/FileUtils'
import MessageUtils from '../../../utils/MessageUtils'
import StringUtils from '../../../utils/StringUtils'
import TopUtils from '../../../utils/TopUtils'
import { CallbackButtonContext, AsyncOrSync, ScrollerSendMessageOptions, ScrollerEditMessageResult, Link, ScrollerGetObjectsOptions } from '../../../utils/values/types/types'
import LinkedChatService from '../../db/services/linkedChat/LinkedChatService'
import ChatSettingsService from '../../db/services/settings/ChatSettingsService'
import UserProfileService from '../../db/services/user/UserProfileService'
import UserRankService from '../../db/services/user/UserRankService'
import InlineKeyboardManager from '../../main/InlineKeyboardManager'
import ScrollerAction from '../scrollers/page/ScrollerAction'

type Object = {
    id: number
    value: number | string
}

export default class extends ScrollerAction<Object> {
    protected _minimumRank = 1

    protected async _getObjects(ctx: CallbackButtonContext, { id, data }: ScrollerGetObjectsOptions): Promise<Object[]> {
        const chatId = await LinkedChatService.getCurrent(ctx, id)
        if(!chatId) return []

        const type = this._getType(data)
        const subCommand = TopUtils.getSubCommand(type)
        const unsortedValues = await subCommand.getUnsortedValues(chatId)

        const sorted = unsortedValues.sort(
            ({value: a}, {value: b}) => {
                if(typeof b == 'string' && typeof a == 'string') {
                    return b.localeCompare(a)
                }
                else {
                    return (b as number) - (a as number)
                }
            }
        )

        const handledSorted = subCommand.handleSortedValues !== undefined ?
            await subCommand.handleSortedValues(sorted)
            : sorted

        return handledSorted
    }

    protected _getType(data: string) {
        const [_increase, _current, type] = data.split('_')
        return type
    }

    constructor() {
        super()
        this._name = 'topch'
        this._objectsPerPage = 20
    }

    protected async _editMessage(
        ctx: CallbackButtonContext, 
        options: ScrollerSendMessageOptions<Object>
    ): Promise<ScrollerEditMessageResult> {
        const id = ctx.from.id
        const chatId = await LinkedChatService.getCurrent(ctx, id)
        if(!chatId) return null

        if(!await UserRankService.has(chatId, id, this._minimumRank)) {
            await ContextUtils.showCallbackMessage(
                ctx,
                await FileUtils.readPugFromResource(
                    'text/other/rank-issue.pug',
                    {
                        changeValues: {
                            rank: this._minimumRank
                        }
                    }
                ),
                true
            )
            return null
        }
        
        const {
            currentPage,
            length,
            objects,
            data
        } = options

        const type = this._getType(data)
        const {
            changeValues,
            emoji
        } = TopUtils.getSubCommand(type)

        const botId = ctx.botInfo.id
        const isUsePlayerId = await ChatSettingsService.get<'boolean'>(chatId, 'pingInTop')

        const sorted = await Promise.all(
            objects.map(async ({id: objId, value}) => {
                const {
                    name,
                    isLeft,
                    id
                } = await UserProfileService.create(chatId, objId)
                return {
                    user: {
                        name,
                        isLeft,
                        link: ContextUtils.getLinkUrl(isUsePlayerId ? id : botId)
                    },
                    value: typeof value == 'string' ? 
                        value : 
                        StringUtils.toFormattedNumber(value)
                }
            })
        )

        return {
            text: await FileUtils.readPugFromResource(
                'text/commands/top/top.pug',
                {
                    changeValues: {
                        emoji,
                        ...changeValues,
                        sorted,
                        page: currentPage,
                        perPage: this._objectsPerPage,
                        length
                    }
                }
            ),
            options: {
                reply_markup: {
                    inline_keyboard: await InlineKeyboardManager.get(
                        'top/change',
                        {
                            page: currentPage,
                            type
                        }
                    )
                },
                link_preview_options: {
                    is_disabled: true
                }
            }
        }
    }

}