import CommandDescriptionUtils from '../../../../utils/CommandDescriptionUtils'
import FileUtils from '../../../../utils/FileUtils'
import { COMMANDS_PER_PAGE } from '../../../../utils/values/consts'
import { CommandDescription, ScrollerEditMessage, ScrollerGetObjectsOptions, ScrollerSendMessageOptions } from '../../../../utils/values/types/types'
import { CallbackButtonContext } from '../../../../utils/values/types/contexts'
import InlineKeyboardManager from '../../../main/InlineKeyboardManager'
import ScrollerAction from './ScrollerAction'

export default class CommandsChangeAction extends ScrollerAction<CommandDescription> {
    constructor () {
        super()
        this._name = 'commandschange'
        this._objectsPerPage = COMMANDS_PER_PAGE
    }

    private _getType(data: string) {
        const [_increase, _current, type] = data.split('_')
        return type
    }

    protected _getObjects(_: CallbackButtonContext, { data }: ScrollerGetObjectsOptions<string>): CommandDescription[] {
        const type = this._getType(data)
        return CommandDescriptionUtils.getVisibleByType(type)
    }

    protected async _editMessage(
        _: CallbackButtonContext,
        {
            currentPage,
            length,
            objects,
            data
        }: ScrollerSendMessageOptions<CommandDescription>
    ): Promise<ScrollerEditMessage> {
        const type = this._getType(data)
        return {
            text: await FileUtils.readPugFromResource(
                'text/actions/commands/commands.pug',
                {
                    changeValues: {
                        commands: objects,
                        page: currentPage,
                        length,
                        title: CommandDescriptionUtils.getTitleByType(type)
                    }
                }
            ),
            options: {
                reply_markup: {
                    inline_keyboard: await InlineKeyboardManager.get('commands/pager', `${currentPage}_${type}`)
                }
            }
        }
    }
}