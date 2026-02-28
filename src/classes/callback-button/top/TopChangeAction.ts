import RankUtils from '../../../utils/RankUtils'
import TopUtils from '../../../utils/TopUtils'
import ScrollerAction from '../scrollers/new/ScrollerAction'
import { CallbackButtonOptions } from '../../../utils/values/types/action-options'
import { NewScrollerData, ScrollerEditMessageOptions, ScrollerEditMessageResult } from '../../../utils/values/types/scrollers'
import ContextUtils from '../../../utils/ContextUtils'
import StringUtils from '../../../utils/StringUtils'
import ChatSettingsService from '../../db/services/settings/ChatSettingsService'
import UserProfileService from '../../db/services/user/UserProfileService'
import { object, string, ZodType } from 'zod'

type Object = {
    id: number
    value: number | string
}
type Additional = {
    type: string
}

export default class extends ScrollerAction<Object, Additional> {
    protected _keyboardFilename: string = 'top/change'
    protected _buttonTitle: string = 'Топ: Пролистывание'
    protected _minimumRank = RankUtils.min

    protected _additionalDataSchema: ZodType<Additional> = object({
        type: string()
    })

    protected async _getRawObjects(options: CallbackButtonOptions<NewScrollerData<Additional>>): Promise<Object[]> {
        const {
            chatId,
            data
        } = options

        const {
            type
        } = data

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

    protected async _editMessage(options: ScrollerEditMessageOptions<Object, Additional>): Promise<ScrollerEditMessageResult> {
        const {
            slicedObjects: objects,
            data,
            ctx,
            chatId,
            page: currentPage,
            maxPage
        } = options
        const length = maxPage + 1

        const {
            type
        } = data

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
                if (!user) return null

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
        )).filter(user => user)

        let isNumbers = true
        const totalCount = hasTotalCount ? objects.reduce((prev, { value }) => {
            if (typeof value == 'number') {
                return prev + value
            }

            isNumbers = false
            return prev
        }, 0) : 0

        return {
            message: {
                path: `text/commands/top/${topOrRole ? 'top' : 'role'}.pug`,
                changeValues: {
                    ...changeValues,
                    emoji,
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
            },
            keyboard: {
                globals: {
                    page: currentPage,
                    type
                }
            }
        }
    }
}