import type { CommandStrings } from "../../types/command"
import StringUtils from "../string/StringUtils"

export default class CommandUtils {
    static readonly botNames: string[] = ['баквит', 'гречка', 'баквид', 'бак']
    private static _availableSymbols: string[] = ['', ',', '*', '.']
    private static _availableBotNameCombinations = this.botNames.reduce(
        (prev, name) => {
            return [
                ...prev,
                ...this._availableSymbols.map(symbol => `${name}${symbol}`),
                ...this._availableSymbols.slice(1).map(symbol => `${symbol}${name}`),
            ]
        },
        [] as string[]
    )

    static isCommand(firstWord: string): boolean {
        const lowerFirstWord = firstWord?.toLowerCase() ?? ''
        return this._availableBotNameCombinations.includes(lowerFirstWord)
    }

    static getCommandStrings(text: string): CommandStrings | undefined {
        const strings = StringUtils.splitByCommands(text, 2) as CommandStrings
        const [
            firstWord,
            command,
            other
        ] = strings

        if (this.isCommand(firstWord)) {
            return [
                firstWord,
                command?.toLowerCase(),
                other
            ]
        }
        else {
            return undefined
        }
    }
}