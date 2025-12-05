import StringUtils from './StringUtils'
import { AsyncOrSync, CommandStrings } from './values/types/types'

export default class CommandUtils {
    private static _botNames: string[] = ['баквит', 'гречка', 'баквид']
    private static _availableSymbols: string[] = ['', ',', '*']

    static getCommandStrings(text: string): CommandStrings {
        return StringUtils.splitByCommands(text, 2) as CommandStrings
    }

    static isCommand(firstWord: string): boolean {
        let isCommand = false
        const lowerFirstWord = firstWord.toLowerCase()

        for (const name of this._botNames) {
            for (const symbol of this._availableSymbols) {
                if (lowerFirstWord == `${name}${symbol}`) {
                    isCommand = true
                    break
                }
            }
        }

        return isCommand
    }

    static async doIfCommand(text: string, callback: (strings: CommandStrings) => AsyncOrSync): Promise<CommandStrings | null> {
        const strings = this.getCommandStrings(text)
        const [firstWord] = strings

        if (this.isCommand(firstWord)) {
            await callback(strings)
            return strings
        }
        else {
            return null
        }
    }
}