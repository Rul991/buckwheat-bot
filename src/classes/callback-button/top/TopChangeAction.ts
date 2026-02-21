import ContextUtils from '../../../utils/ContextUtils'
import FileUtils from '../../../utils/FileUtils'
import RankUtils from '../../../utils/RankUtils'
import StringUtils from '../../../utils/StringUtils'
import TopUtils from '../../../utils/TopUtils'
import { ScrollerSendMessageOptions, ScrollerEditMessageResult, ScrollerGetObjectsOptions } from '../../../utils/values/types/types'
import { CallbackButtonContext } from '../../../utils/values/types/contexts'
import ChatSettingsService from '../../db/services/settings/ChatSettingsService'
import UserProfileService from '../../db/services/user/UserProfileService'
import LegacyInlineKeyboardManager from '../../main/LegacyInlineKeyboardManager'
import ScrollerAction from '../scrollers/page/ScrollerAction'

type Object = {
    id: number
    value: number | string
}

export default class extends ScrollerAction<Object> {
    protected _buttonTitle: string = 'Топ: Пролистывание'
    protected _minimumRank = RankUtils.min

    protected async _getObjects(ctx: CallbackButtonContext, { data, chatId }: ScrollerGetObjectsOptions): Promise<Object[]> {
        const type = this._getType(data)
        const subCommand = TopUtils.getSubCommand(type)
        const unsortedValues = await subCommand.getUnsortedValues(chatId)

        const sorted = unsortedValues.sort(
            ({ value: a }, { value: b }) => {
                if (typeof b == 'string' && typeof a == 'string') {
                    return b.localeCompare(a)
                }
                else {
                    return (b as number) - (a as number)
                }
            }
        )

        const handledSorted = subCommand.handleSortedValues !== undefined ?
            await subCommand.handleSortedValues({ chatId, values: sorted })
            : sorted

        return handledSorted
    }

    protected _getType(data: string) {
        const [_increase, _current, type] = data.split('_')
        return type
    }

    constructor () {
        super()
        this._name = 'topch'
        this._objectsPerPage = 20
    }

    protected async _editMessage(
        ctx: CallbackButtonContext,
        options: ScrollerSendMessageOptions<Object>,
    ): Promise<ScrollerEditMessageResult> {
        const {
            id,
            chatId
        } = options

        const {
            currentPage,
            length,
            objects,
            data
        } = options

        const type = this._getType(data)
        const {
            changeValues,
            emoji,
            name,
            hasTotalCount = true,
            hasWinner = hasTotalCount,
            topOrRole = true
        } = TopUtils.getSubCommand(type)

        const isPrivate = ctx.chat?.type == 'private'
        const botId = ctx.botInfo.id
        const isUsePlayerId = isPrivate ||
            await ChatSettingsService.get<'boolean'>(chatId, 'link')

        const sorted = (await Promise.all(
            objects.map(async ({ id: objId, value }) => {
                const user = await UserProfileService.get(chatId, objId)
                if(!user) return null

                const {
                    name,
                    id
                } = user

                return {
                    user: {
                        name,
                        isLeft: false,
                        link: ContextUtils.getLinkUrl(isUsePlayerId ? id : botId)
                    },
                    value: typeof value == 'string' ?
                        value :
                        StringUtils.toFormattedNumber(value)
                }
            })
        )).filter(user => !user)

        let isNumbers = true
        const totalCount = hasTotalCount ? objects.reduce((prev, { value }) => {
            if (typeof value == 'number') {
                return prev + value
            }

            isNumbers = false
            return prev
        }, 0) : 0

        return {
            text: await FileUtils.readPugFromResource(
                `text/commands/top/${topOrRole ? 'top' : 'role'}.pug`,
                {
                    changeValues: {
                        emoji,
                        ...changeValues,
                        sorted,
                        page: currentPage,
                        perPage: this._objectsPerPage,
                        length,
                        isNumbers,
                        rawTotalCount: totalCount,
                        totalCount: StringUtils.toFormattedNumber(totalCount),
                        totalName: name,
                        hasWinner
                    }
                }
            ),
            options: {
                reply_markup: {
                    inline_keyboard: await LegacyInlineKeyboardManager.get(
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