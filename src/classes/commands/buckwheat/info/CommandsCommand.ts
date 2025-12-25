import CommandDescriptionUtils from '../../../../utils/CommandDescriptionUtils'
import MessageUtils from '../../../../utils/MessageUtils'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'
import { MaybeString } from '../../../../utils/values/types/types'
import { TextContext } from '../../../../utils/values/types/contexts'
import InlineKeyboardManager from '../../../main/InlineKeyboardManager'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default class CommandsCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'команды'
        this._description = 'я выдаю данный список'
        this._aliases = [
            'команда',
            'лист',
            'функции',
            'как'
        ]
    }

    async execute({ ctx }: BuckwheatCommandOptions): Promise<void> {
        const commands = CommandDescriptionUtils
            .getVisible()

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/actions/commands/start.pug',
            {
                changeValues: {
                    length: commands.length
                },
                inlineKeyboard: await InlineKeyboardManager.get('commands/start')
            }
        )
    }
}