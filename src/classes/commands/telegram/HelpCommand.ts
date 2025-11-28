import { TextContext, MaybeString } from '../../../utils/values/types/types'
import TelegramCommand from '../base/TelegramCommand'
import FaqCommand from '../buckwheat/info/FaqCommand'

export default class HelpCommand extends TelegramCommand {
    private static _faqCommand = new FaqCommand()

    constructor() {
        super()
        this._name = 'help'
        this._description = 'Команда для получения помощи'
    }

    async execute(ctx: TextContext, other: MaybeString): Promise<void> {
        return await HelpCommand._faqCommand.execute(ctx, other)
    }
}