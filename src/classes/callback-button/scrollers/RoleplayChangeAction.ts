import FileUtils from '../../../utils/FileUtils'
import { CallbackButtonContext, ScrollerSendMessageOptions, ScrollerEditMessageResult } from '../../../utils/values/types'
import LinkedChatService from '../../db/services/linkedChat/LinkedChatService'
import RoleplaysService from '../../db/services/rp/RoleplaysService'
import CallbackButtonManager from '../../main/CallbackButtonManager'
import ScrollerAction from './ScrollerAction'

export default class RoleplayChangeAction extends ScrollerAction<[string, string]> {
    constructor() {
        super()
        this._name = 'roleplaychange'
        this._objectsPerPage = 10
    }

    protected async _getObjects(ctx: CallbackButtonContext): Promise<[string, string][]> {
        const chatId = await LinkedChatService.getCurrent(ctx)
        if(!chatId) return []

        return await RoleplaysService.getCommands(chatId)
    }

    protected async _editMessage(
        _: CallbackButtonContext, 
        {
            currentPage,
            length,
            objects
        }: ScrollerSendMessageOptions<[string, string]>
    ): Promise<ScrollerEditMessageResult> {
        return {
            text: await FileUtils.readPugFromResource(
                'text/commands/add-rp/list.pug',
                {
                    changeValues: {
                        length,
                        page: currentPage,
                        commands: objects
                    }
                }
            ),
            options: {
                reply_markup: {
                    inline_keyboard: await CallbackButtonManager.get('roleplaychange', `${currentPage}`)
                },
            }
        }
    }
}