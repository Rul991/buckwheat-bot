import { CommandDescription } from './values/types'

export default class CommandDescriptionUtils {
    private static _commandDescriptions: CommandDescription[] = []
    private static _secretCommandDescriptions: CommandDescription[] = []
    private static _allCommandDescriptions: CommandDescription[] = []

    static getVisible(): CommandDescription[] {
        return this._commandDescriptions
    }

    static getSecret(): CommandDescription[] {
        return this._secretCommandDescriptions
    }

    static getAll(): CommandDescription[] {
        return this._allCommandDescriptions
    }

    static has(name: string): boolean {
        return this.getAll().some(cmd => cmd.name == name)
    }

    static add(description: CommandDescription): void {
        if(description.isShow) {
            this._commandDescriptions.push(description)
        }
        else {
            this._secretCommandDescriptions.push(description)
        }

        this._allCommandDescriptions.push(description)
    }
}