import { ClassTypes, ClassRecord } from './types'

export default class ClassUtils {
    private static _classNames: ClassRecord = {
        knight: 'Рыцарь',
        thief: 'Вор',
        sorcerer: 'Маг',
        engineer: 'Инженер',
        bard: 'Бард',
        unknown: 'Не выбрано'
    }

    private static _classEmojies: ClassRecord = {
        knight: '🗡',
        thief: '🏹',
        sorcerer: '🪄',
        engineer: '🧤',
        bard: '🎸',
        unknown: '🤷‍♂️'
    }

    static getEmoji(type: ClassTypes): string {
        return this._classEmojies[type]
    }

    static getName(type: ClassTypes): string {
        return this._classNames[type]
    }
}