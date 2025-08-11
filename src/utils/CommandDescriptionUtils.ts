import { CommandDescription } from './types'

export default class CommandDescriptionUtils {
    private static _commandDescriptions: CommandDescription[] = []

    static get(): CommandDescription[] {
        return this._commandDescriptions
    }

    static add(description: CommandDescription): void {
        if(!description.isShow) return
        this._commandDescriptions.push(description)
    }
}