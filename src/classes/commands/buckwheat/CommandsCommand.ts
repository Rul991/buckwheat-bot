import CommandDescriptionUtils from '../../../utils/CommandDescriptionUtils'
import MessageUtils from '../../../utils/MessageUtils'
import { TextContext, MaybeString } from '../../../utils/values/types'
import BuckwheatCommand from '../base/BuckwheatCommand'

export default class CommandsCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'команды'
        this._description = 'я выдаю данный список'
    }

    async execute(ctx: TextContext, other: MaybeString): Promise<void> {
        const commands = CommandDescriptionUtils
            .getVisible()

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/commands.pug',
            {changeValues: {commands}}
        )
    }
}