import CommandDescriptionUtils from '../../utils/CommandDescriptionUtils'
import FileUtils from '../../utils/FileUtils'
import MessageUtils from '../../utils/MessageUtils'
import Pager from '../../utils/Pager'
import { COMMANDS_PER_PAGE } from '../../utils/values/consts'
import { CallbackButtonContext } from '../../utils/values/types'
import InlineKeyboardManager from '../main/InlineKeyboardManager'
import CallbackButtonAction from './CallbackButtonAction'

export default class CommandsChangeAction extends CallbackButtonAction {
    constructor() {
        super()
        this._name = 'commandschange'
    }

    async execute(ctx: CallbackButtonContext, data: string): Promise<string | void> {
        const commands = CommandDescriptionUtils.getVisible()
        const length = Math.ceil(commands.length / COMMANDS_PER_PAGE)

        const page = Pager.wrapPages(data, length)
        await MessageUtils.editText(
            ctx,
            await FileUtils.readPugFromResource(
                'text/actions/commands/commands.pug',
                {
                    changeValues: {
                        commands: commands.slice(COMMANDS_PER_PAGE * page, COMMANDS_PER_PAGE * (page + 1)),
                        page,
                        length
                    }
                }
            ),
            {
                reply_markup: {
                    inline_keyboard: await InlineKeyboardManager.get('commands/pager', `${page}`)
                }
            }
        )
    }
}