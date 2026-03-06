import Award from '../../../../interfaces/schemas/awards/Award'
import AwardsService from '../../../db/services/awards/AwardsService'
import ScrollerAction from '../new/ScrollerAction'
import { CallbackButtonOptions } from '../../../../utils/values/types/action-options'
import { NewScrollerData, ScrollerEditMessageOptions, ScrollerEditMessageResult } from '../../../../utils/values/types/scrollers'
import ContextUtils from '../../../../utils/ContextUtils'
import FileUtils from '../../../../utils/FileUtils'
import { number, object, ZodType } from 'zod'

type T = Award
type A = {
    u: number
}

export default class AwardsChangeAction extends ScrollerAction<T, A> {
    protected _keyboardFilename: string = 'awards/change'
    protected _buttonTitle: string = 'Награды: Пролистывание'
    protected _additionalDataSchema: ZodType<A> = object({
        u: number()
    })

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
            data,
        } = options
        
        const {
            u: id
        } = data

        const awards = await AwardsService.get(chatId, id)
        return awards.awards ?? []
    }

    protected async _editMessage(options: ScrollerEditMessageOptions<Award, A>): Promise<ScrollerEditMessageResult> {
        const {
            slicedObjects,
            chatId,
            data,
            page: currentPage,
            id: requesterId
        } = options

        const {
            u: ownerId,
            id: dataId
        } = data

        const [object] = slicedObjects
        if(!object) return await FileUtils.readPugFromResource(
            'text/commands/award/no-award.pug'
        )

        const {
            givenBy
        } = object
        const isGiver = givenBy ? 
            givenBy == requesterId :
            ownerId == requesterId

        return {
            message: {
                path: 'text/commands/award/get.pug',
                changeValues: {
                    user: await ContextUtils.getUser(chatId, ownerId),
                    giver: givenBy ? 
                        await ContextUtils.getUser(chatId, givenBy) :
                        await ContextUtils.getUser(chatId, ownerId),
                    award: object,
                    page: currentPage,
                    emoji: AwardsChangeAction._emojis[object.rank - 1]
                }
            },
            keyboard: {
                globals: {
                    isGiver,
                    requesterId,
                    ownerId,
                    currentPage,
                    dataId
                }
            }
        }
    }

}