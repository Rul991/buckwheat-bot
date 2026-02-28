import { object, string, ZodType } from 'zod'
import { CallbackButtonOptions } from '../../../utils/values/types/action-options'
import { NewScrollerData, ScrollerEditMessageOptions, ScrollerEditMessageResult } from '../../../utils/values/types/scrollers'
import ScrollerAction from '../scrollers/new/ScrollerAction'
import SearchUtils from '../../../utils/SearchUtils'
import { Link } from '../../../utils/values/types/types'
import ContextUtils from '../../../utils/ContextUtils'

type T = Link
type A = {
    other: string
}

export default class extends ScrollerAction<T, A> {
    protected _keyboardFilename: string = 'search/change'
    protected _additionalDataSchema: ZodType<A> = object({
        other: string()
    })

    constructor () {
        super()
        this._name = 'searchg'
        this._buttonTitle = 'Поиск: Пролистывание'
        this._objectsPerPage = 20
    }

    protected async _getRawObjects(options: CallbackButtonOptions<NewScrollerData<A>>): Promise<T[]> {
        const {
            users
        } = await SearchUtils.getUsers(options)

        return users.map(({id, name}) => {
            return {
                name,
                link: ContextUtils.getLinkUrl(id)
            }
        })
    }

    protected async _editMessage(options: ScrollerEditMessageOptions<T, A>): Promise<ScrollerEditMessageResult> {
        const {
            slicedObjects,
            data,
            objects
        } = options

        const {
            other,
        } = data
        const searchUsersLength = objects.length

        return {
            message: {
                path: 'text/commands/search/result.pug',
                changeValues: {
                    other,
                    users: slicedObjects,
                    searchUsersLength
                }
            },

            keyboard: {
                
            }
        }
    }
}