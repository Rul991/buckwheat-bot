import { BuckwheatCommandOptions } from '../../../utils/values/types/action-options'
import TelegramCommand from '../base/TelegramCommand'
import CommandsCommand from '../buckwheat/info/CommandsCommand'

export default class TelegramCommandsCommand extends TelegramCommand {
    private static _command = new CommandsCommand()

    constructor() {
        super()
        this._name = 'commands'
        this._description = '📚 Команды'
    }

    async execute(options: BuckwheatCommandOptions): Promise<void> {
        return await TelegramCommandsCommand._command.execute(options)
    }
}