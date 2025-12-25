import { BuckwheatCommandOptions } from '../../../utils/values/types/action-options'
import { MaybeString } from '../../../utils/values/types/types'
import { TextContext } from '../../../utils/values/types/contexts'
import TelegramCommand from '../base/TelegramCommand'
import FaqCommand from '../buckwheat/info/FaqCommand'

export default class HelpCommand extends TelegramCommand {
    private static _faqCommand = new FaqCommand()

    constructor() {
        super()
        this._name = 'help'
        this._description = 'Команда для получения помощи'
    }

    async execute(options: BuckwheatCommandOptions): Promise<void> {
        return await HelpCommand._faqCommand.execute(options)
    }
}