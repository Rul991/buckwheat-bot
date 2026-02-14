import FileUtils from '../../../../utils/FileUtils'
import { ScrollerSendMessageOptions, ScrollerEditMessageResult, ScrollerGetObjectsOptions } from '../../../../utils/values/types/types'
import { CallbackButtonContext } from '../../../../utils/values/types/contexts'
import RoleplaysService from '../../../db/services/rp/RoleplaysService'
import LegacyInlineKeyboardManager from '../../../main/LegacyInlineKeyboardManager'
import ScrollerAction from './ScrollerAction'

type Data = string[]

export default class RoleplayChangeAction extends ScrollerAction<Data> {
    protected _buttonTitle: string = 'РП: Пролистывание'
    constructor() {
        super()
        this._name = 'roleplaychange'
        this._objectsPerPage = 10
    }

    protected async _getObjects(ctx: CallbackButtonContext, { chatId }: ScrollerGetObjectsOptions<string>): Promise<Data[]> {
        return await RoleplaysService.getCommands(chatId)
    }

    protected async _editMessage(
        _: CallbackButtonContext, 
        {
            currentPage,
            length,
            objects
        }: ScrollerSendMessageOptions<Data>
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
                    inline_keyboard: await LegacyInlineKeyboardManager.get('roleplaychange', `${currentPage}`)
                },
            }
        }
    }
}