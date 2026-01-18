import { CommandDescription, CommandVisibleTypes } from './values/types/types'

export default class CommandDescriptionUtils {
    private static _commandDescriptions: CommandDescription[] = []
    private static _secretCommandDescriptions: CommandDescription[] = []
    private static _allCommandDescriptions: CommandDescription[] = []
    private static _visibleTypes = [] as CommandVisibleTypes[]

    static getVisible(): CommandDescription[] {
        return this._commandDescriptions
    }

    static getSecret(): CommandDescription[] {
        return this._secretCommandDescriptions
    }

    static getAll(): CommandDescription[] {
        return this._allCommandDescriptions
    }

    static getVisibleByType(type: string) {
        return this.getVisible()
            .filter(v => v.type == type)
    }

    static getVisibleTypes() {
        return this._visibleTypes
    }

    static getTitleByType(type: string) {
        const visibleType = this._visibleTypes.find(v => v.type == type)
        return visibleType?.title ?? '???'
    }

    static has(name: string): boolean {
        return this.getAll().some(cmd => cmd.name == name)
    }

    static add(description: CommandDescription): void {
        if(description.isShow) {
            this._commandDescriptions.push(description)
            if(this._visibleTypes.every(v => v.type != description.type)) {
                this._visibleTypes.push({
                    type: description.type,
                    title: description.typeName
                })
            }
        }
        else {
            this._secretCommandDescriptions.push(description)
        }

        this._allCommandDescriptions.push(description)
    }
}