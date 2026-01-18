import { BotCommand } from 'telegraf/types'
import BuckwheatCommand from './BuckwheatCommand'

export default abstract class TelegramCommand extends BuckwheatCommand {
    constructor() {
        super()
    }

    get botCommand(): BotCommand & {isShow: boolean} {
        return {
            command: this._name, 
            description: this._description, 
            isShow: this._isShow
        }
    }
}