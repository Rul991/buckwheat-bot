import Award from '../../../../interfaces/schemas/awards/Award'
import ContextUtils from '../../../../utils/ContextUtils'
import FileUtils from '../../../../utils/FileUtils'
import { CallbackButtonContext, ScrollerSendMessageOptions, ScrollerEditMessageResult, AsyncOrSync } from '../../../../utils/values/types'
import AwardsService from '../../../db/services/awards/AwardsService'
import LinkedChatService from '../../../db/services/linkedChat/LinkedChatService'
import InlineKeyboardManager from '../../../main/InlineKeyboardManager'
import ScrollerAction from './ScrollerAction'

export default class AwardsChangeAction extends ScrollerAction<Award> {
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

    protected async _getObjects(ctx: CallbackButtonContext, id: number): Promise<Award[]> {
        const chatId = await LinkedChatService.getCurrent(ctx, id)
        if(!chatId) return []

        const awards = await AwardsService.get(chatId, id)
        return awards.awards ?? []
    }

    protected async _editMessage(
        ctx: CallbackButtonContext, 
        {
            currentPage,
            objects,
            length,
            id
        }: ScrollerSendMessageOptions<Award>
    ): Promise<ScrollerEditMessageResult> {
        const [object] = objects
        const chatId = await LinkedChatService.getCurrent(ctx, id)
        if(!chatId) return null

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
                    inline_keyboard: await InlineKeyboardManager.get('awards/change', `${currentPage}_${id}`)
                }
            }
        }
    }

}