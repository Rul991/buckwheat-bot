import CommandDescriptionUtils from '../../../../utils/CommandDescriptionUtils'
import MessageUtils from '../../../../utils/MessageUtils'
import { TextContext, MaybeString } from '../../../../utils/values/types'
import CallbackButtonManager from '../../../main/CallbackButtonManager'
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

    async execute(ctx: TextContext, _: MaybeString): Promise<void> {
        const commands = CommandDescriptionUtils
            .getVisible()

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/actions/commands/start.pug',
            {
                changeValues: {
                    length: commands.length
                },
                inlineKeyboard: await CallbackButtonManager.get('commands/start')
            }
        )
    }
}