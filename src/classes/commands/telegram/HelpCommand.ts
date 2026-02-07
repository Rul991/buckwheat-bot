import { BuckwheatCommandOptions } from '../../../utils/values/types/action-options'
import TelegramCommand from '../base/TelegramCommand'
import FaqCommand from '../buckwheat/info/FaqCommand'

export default class HelpCommand extends TelegramCommand {
    private static _faqCommand = new FaqCommand()

    constructor() {
        super()
        this._name = 'help'
        this._description = '🆘 Помощь'
    }

    async execute(options: BuckwheatCommandOptions): Promise<void> {
        return await HelpCommand._faqCommand.execute(options)
    }
}