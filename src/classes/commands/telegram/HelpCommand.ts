import StartCommand from './StartCommand'

export default class HelpCommand extends StartCommand {
    constructor() {
        super()
        this._name = 'help'
        this._description = 'Команда для получения помощи'
    }
}