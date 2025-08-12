import StringUtils from './StringUtils'
import { CommandStrings } from './types'

export default class CommandUtils {
    private static _botNames: string[] = ['баквит', 'гречка']

    static getCommandStrings(text: string): CommandStrings {
        const [firstWord, command, ...other] = StringUtils.splitBySpace(text)

        return [firstWord, command, other?.join(' ')]
    }

    static isCommand(firstWord: string): boolean {
        let isCommand = false
        const lowerFirstWord = firstWord.toLowerCase()

        for (const name of this._botNames) {
            if(lowerFirstWord.startsWith(name)) {
                isCommand = true
                break
            }
        }

        return isCommand
    }
}