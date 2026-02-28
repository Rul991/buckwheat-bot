import AvaHistory from '../../../interfaces/schemas/user/AvaHistory'
import ContextUtils from '../../../utils/ContextUtils'
import TimeUtils from '../../../utils/TimeUtils'
import { CallbackButtonOptions } from '../../../utils/values/types/action-options'
import { NewScrollerData, ScrollerEditMessageOptions, ScrollerEditMessageResult } from '../../../utils/values/types/scrollers'
import AvaHistoryService from '../../db/services/user/AvaHistoryService'
import UserImageService from '../../db/services/user/UserImageService'
import ScrollerAction from '../scrollers/new/ScrollerAction'

type T = AvaHistory
type A = {}

export default class extends ScrollerAction<T, A> {
    protected _keyboardFilename: string = 'profile/ava'

    constructor () {
        super()
        this._name = 'avachange'
        this._buttonTitle = 'Аватарка: История'
        this._objectsPerPage = 1
    }

    protected async _getRawObjects(options: CallbackButtonOptions<NewScrollerData<A>>): Promise<AvaHistory[]> {
        const {
            chatId,
            id
        } = options
        return await AvaHistoryService.get(chatId, id)
    }

    protected async _editMessage(options: ScrollerEditMessageOptions<AvaHistory, A>): Promise<ScrollerEditMessageResult> {
        const {
            chatId,
            id,
            slicedObjects: [ava],
            maxPage,
            page: currentPage,
            ctx
        } = options
        if (!ava) return

        const length = maxPage + 1
        const {
            imageId,
            createdAt
        } = ava
        const currentImageId = await UserImageService.get(chatId, id)

        const elapsedTime = TimeUtils.getElapsed(createdAt)
        if (await ContextUtils.showAlertIfIdNotEqual(ctx, id)) return

        return {
            message: {
                path: 'text/commands/profile/ava/ava.pug',
                changeValues: {
                    user: await ContextUtils.getUser(chatId, id),
                    page: currentPage,
                    length,
                    time: TimeUtils.formatMillisecondsToTime(elapsedTime),
                    isCurrentImage: currentImageId == imageId
                }
            },
            media: {
                type: 'photo',
                media: imageId
            },
            keyboard: {
                globals: {
                    current: currentPage,
                    id
                }
            }
        }
    }
}