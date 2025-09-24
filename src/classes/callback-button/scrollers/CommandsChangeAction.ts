import CommandDescriptionUtils from '../../../utils/CommandDescriptionUtils'
import FileUtils from '../../../utils/FileUtils'
import { COMMANDS_PER_PAGE } from '../../../utils/values/consts'
import { CallbackButtonContext, CommandDescription, ScrollerEditMessage, ScrollerSendMessageOptions } from '../../../utils/values/types'
import InlineKeyboardManager from '../../main/InlineKeyboardManager'
import ScrollerAction from './ScrollerAction'

export default class CommandsChangeAction extends ScrollerAction<CommandDescription> {
    constructor() {
        super()
        this._name = 'commandschange'
        this._objectsPerPage = COMMANDS_PER_PAGE
    }

    protected _getObjects(_: CallbackButtonContext): CommandDescription[] {
        return CommandDescriptionUtils.getVisible()
    }

    protected async _editMessage(
        _: CallbackButtonContext, 
        {
            currentPage, 
            length, 
            objects
        }: ScrollerSendMessageOptions<CommandDescription>
    ): Promise<ScrollerEditMessage> {
        return {
            text: await FileUtils.readPugFromResource(
                'text/actions/commands/commands.pug',
                {
                    changeValues: {
                        commands: objects,
                        page: currentPage,
                        length
                    }
                }
            ),
            options: {
                reply_markup: {
                    inline_keyboard: await InlineKeyboardManager.get('commands/pager', `${currentPage}`)
                }
            }
        }
    }
}