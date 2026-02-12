import AvaHistory from '../../../interfaces/schemas/user/AvaHistory'
import ContextUtils from '../../../utils/ContextUtils'
import FileUtils from '../../../utils/FileUtils'
import TimeUtils from '../../../utils/TimeUtils'
import { CallbackButtonContext } from '../../../utils/values/types/contexts'
import { ScrollerGetObjectsOptions, ScrollerSendMessageOptions, ScrollerEditMessageResult, AsyncOrSync } from '../../../utils/values/types/types'
import AvaHistoryService from '../../db/services/user/AvaHistoryService'
import LegacyInlineKeyboardManager from '../../main/LegacyInlineKeyboardManager'
import ScrollerAction from '../scrollers/page/ScrollerAction'

type T = AvaHistory
type D = [number, number, number] // increase, current, id

export default class extends ScrollerAction<T, D> {
    constructor () {
        super()
        this._name = 'avachange'
        this._buttonTitle = 'История аватарок'
        this._objectsPerPage = 1
    }

    protected _convertDataToObject(raw: string): D {
        return raw.split('_').map(v => +v) as D
    }

    protected _getId(ctx: CallbackButtonContext, data: D): AsyncOrSync<number> {
        return data[2]
    }

    protected async _getObjects(
        ctx: CallbackButtonContext,
        {
            id,
            chatId,
        }: ScrollerGetObjectsOptions<D>
    ): Promise<T[]> {
        return await AvaHistoryService.get(chatId, id)
    }

    protected async _editMessage(ctx: CallbackButtonContext, options: ScrollerSendMessageOptions<T, D>): Promise<ScrollerEditMessageResult> {
        const {
            data,
            chatId,
            id,
            objects: [ava],
            length,
            currentPage
        } = options

        const {
            imageId,
            createdAt
        } = ava

        const elapsedTime = TimeUtils.getElapsed(createdAt)
        if (await ContextUtils.showAlertIfIdNotEqual(ctx, id)) return null

        return {
            text: await FileUtils.readPugFromResource(
                'text/commands/profile/ava.pug',
                {
                    changeValues: {
                        user: await ContextUtils.getUser(chatId, id),
                        page: currentPage,
                        length,
                        time: TimeUtils.formatMillisecondsToTime(elapsedTime)
                    }
                }
            ),
            media: {
                type: 'photo',
                media: imageId
            },
            options: {
                reply_markup: {
                    inline_keyboard: await LegacyInlineKeyboardManager.get(
                        'profile/ava',
                        {
                            current: currentPage,
                            id
                        }
                    )
                }
            }
        }
    }
}