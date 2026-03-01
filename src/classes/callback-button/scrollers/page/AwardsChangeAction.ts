import Award from '../../../../interfaces/schemas/awards/Award'
import AwardsService from '../../../db/services/awards/AwardsService'
import ScrollerAction from '../new/ScrollerAction'
import { CallbackButtonOptions } from '../../../../utils/values/types/action-options'
import { NewScrollerData, ScrollerEditMessageOptions, ScrollerEditMessageResult } from '../../../../utils/values/types/scrollers'
import ContextUtils from '../../../../utils/ContextUtils'
import FileUtils from '../../../../utils/FileUtils'

type T = Award
type A = {}

export default class AwardsChangeAction extends ScrollerAction<T, A> {
    protected _keyboardFilename: string = 'awards/change'
    protected _buttonTitle: string = 'Награды: Пролистывание'

    private static _emojis = [
        '🎗',
        '🥉',
        '🥈',
        '🥇',
        '🏅',
        '🎖',
        '🏆',
        '👑',
    ]

    constructor () {
        super()
        this._name = 'awardschange'
        this._objectsPerPage = 1
    }

    protected async _getRawObjects(options: CallbackButtonOptions<NewScrollerData<A>>): Promise<T[]> {
        const {
            chatId,
            id
        } = options

        const awards = await AwardsService.get(chatId, id)
        return awards.awards ?? []
    }

    protected async _editMessage(options: ScrollerEditMessageOptions<Award, A>): Promise<ScrollerEditMessageResult> {
        const {
            slicedObjects,
            chatId,
            id,
            objects,
            page: currentPage
        } = options

        const length = objects.length
        const [object] = slicedObjects
        if(!object) return await FileUtils.readPugFromResource(
            'text/commands/award/no-award.pug'
        )

        return {
            message: {
                path: 'text/commands/award/get.pug',
                changeValues: {
                    ...await ContextUtils.getUser(chatId, id),
                    award: object,
                    length,
                    page: currentPage,
                    emoji: AwardsChangeAction._emojis[object.rank - 1]
                }
            },
            keyboard: {
                
            }
        }
    }

}