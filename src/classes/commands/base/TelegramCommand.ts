import { BotCommand } from 'telegraf/types'
import BuckwheatCommand from './BuckwheatCommand'

export default abstract class TelegramCommand extends BuckwheatCommand {
    protected _description: string

    constructor() {
        super()

        this._description = ''
    }

    get botCommand(): BotCommand {
        return {command: this._name, description: this._description}
    }
}