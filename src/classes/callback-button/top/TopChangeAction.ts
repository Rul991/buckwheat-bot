import RankUtils from '../../../utils/RankUtils'
import TopUtils from '../../../utils/TopUtils'
import ScrollerAction from '../scrollers/new/ScrollerAction'
import { CallbackButtonOptions } from '../../../utils/values/types/action-options'
import { NewScrollerData, ScrollerEditMessageOptions, ScrollerEditMessageResult } from '../../../utils/values/types/scrollers'
import ContextUtils from '../../../utils/ContextUtils'
import StringUtils from '../../../utils/StringUtils'
import UserProfileService from '../../db/services/user/UserProfileService'
import { object, string, ZodType } from 'zod'
import { Link } from '../../../utils/values/types/types'

type Object = {
    user: Link & {
        isLeft: boolean
    }
    value: number | string
    id: number
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

        const ids = handledSorted.map(v => v.id)
        const users = await UserProfileService.getManyByIds(
            chatId,
            ids
        )

        const namedSorted = (await Promise.all(
            handledSorted.map(async ({ id: objId, value }) => {
                const user = users.find(v => v.id == objId)
                if (!user) return null

                const {
                    name,
                    id
                } = user

                return {
                    user: {
                        name,
                        isLeft: false,
                        link: ContextUtils.getLinkUrl(id)
                    },
                    id,
                    value
                }
            })
        ))

        const namedNotNullSorted = namedSorted
            .filter(user => user !== null)

        return namedNotNullSorted
    }

    constructor() {
        super()
        this._name = 'topch'
        this._objectsPerPage = 20
    }

    protected async _editMessage(options: ScrollerEditMessageOptions<Object, Additional>): Promise<ScrollerEditMessageResult> {
        const {
            objects,
            slicedObjects,
            data,
            page: currentPage,
            id,
        } = options

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

        const totalCount = hasTotalCount ? objects.reduce((prev, { value }) => {
            if (typeof value == 'number') {
                return prev + value
            }

            return prev
        }, 0) : 0

        const playerPlace = objects.findIndex(
            v => v.id == id
        ) + 1

        return {
            message: {
                path: `text/commands/top/${topOrRole ? 'top' : 'role'}.pug`,
                changeValues: {
                    ...changeValues,
                    emoji,
                    sorted: slicedObjects,
                    page: currentPage,
                    perPage: this._objectsPerPage,
                    totalCount,
                    totalName: name,
                    hasWinner,
                    playerPlace,
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