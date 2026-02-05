import Award from '../../../../interfaces/schemas/awards/Award'
import ContextUtils from '../../../../utils/ContextUtils'
import FileUtils from '../../../../utils/FileUtils'
import { ScrollerSendMessageOptions, ScrollerEditMessageResult, AsyncOrSync, ScrollerGetObjectsOptions } from '../../../../utils/values/types/types'
import { CallbackButtonContext } from '../../../../utils/values/types/contexts'
import AwardsService from '../../../db/services/awards/AwardsService'
import LegacyInlineKeyboardManager from '../../../main/LegacyInlineKeyboardManager'
import ScrollerAction from './ScrollerAction'

export default class AwardsChangeAction extends ScrollerAction<Award> {
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

    constructor() {
        super()
        this._name = 'awardschange'
        this._objectsPerPage = 1
    }

    protected _getId(_: CallbackButtonContext, data: string): AsyncOrSync<number> {
        const [_increase, _page, id] = data.split('_').map(v => +v)
        return id
    }

    protected async _getObjects(ctx: CallbackButtonContext, { id, chatId }: ScrollerGetObjectsOptions): Promise<Award[]> {
        const awards = await AwardsService.get(chatId, id)
        return awards.awards ?? []
    }

    protected async _editMessage(
        ctx: CallbackButtonContext, 
        {
            currentPage,
            objects,
            length,
            id,
            chatId
        }: ScrollerSendMessageOptions<Award>
    ): Promise<ScrollerEditMessageResult> {
        const [object] = objects

        return {
            text: await FileUtils.readPugFromResource(
                'text/commands/award/get.pug',
                {
                    changeValues: {
                        ...await ContextUtils.getUser(chatId, id),
                        award: object,
                        length,
                        page: currentPage,
                        emoji: AwardsChangeAction._emojis[object.rank - 1]
                    }
                }
            ),
            options: {
                reply_markup: {
                    inline_keyboard: await LegacyInlineKeyboardManager.get('awards/change', `${currentPage}_${id}`)
                }
            }
        }
    }

}