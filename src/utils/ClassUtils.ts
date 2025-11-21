import { ClassTypes, ClassRecord } from './values/types'

export default class ClassUtils {
    static defaultClassName: 'unknown' = 'unknown'
    static nonPlayerClassNames: ClassTypes[] = ['unknown', 'boss', 'bot']
    static playerClassNames: ClassTypes[] = ['bard', 'engineer', 'knight', 'sorcerer', 'thief']

    private static _visibleClassNames = {
        knight: 'Рыцарь',
        thief: 'Вор',
        sorcerer: 'Маг',
        engineer: 'Инженер',
        bard: 'Бард',
    }

    private static _classNames: ClassRecord = {
        ...this._visibleClassNames,
        bot: 'НПС',
        boss: 'Финальный босс',
        [this.defaultClassName]: 'Не выбрано'
    }

    private static _classEmojies: ClassRecord = {
        knight: '🗡',
        thief: '🏹',
        sorcerer: '🪄',
        engineer: '🧤',
        bard: '🎸',
        boss: '💀',
        bot: '🤖',
        [this.defaultClassName]: '🤷‍♂️'
    }
    
    static getEmoji(type: ClassTypes): string {
        return this._classEmojies[type] ?? this._classEmojies[this.defaultClassName]
    }

    static getName(type: ClassTypes): string {
        return this._classNames[type] ?? this._classNames[this.defaultClassName]
    }

    static getNames(): ClassRecord {
        return this._classNames
    }

    static getVisibleNames() {
        return this._visibleClassNames
    }

    static getArray(): Record<ClassTypes, string[]> {
        return Object.entries(this._classNames).reduce(
            (obj, [key]) => {
                return {...obj, [key as ClassTypes]: []}
            }, 
            {} as Record<ClassTypes, string[]>
        )
    }

    static isPlayer(type: ClassTypes) {
        return ClassUtils.playerClassNames.some(v => v == type)
    }
}