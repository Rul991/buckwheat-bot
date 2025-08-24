import { ClassTypes, ClassRecord } from './values/types'

export default class ClassUtils {
    static defaultClassName: 'unknown' = 'unknown'

    private static _classNames: ClassRecord = {
        knight: 'Рыцарь',
        thief: 'Вор',
        sorcerer: 'Маг',
        engineer: 'Инженер',
        bard: 'Бард',
        boss: 'Финальный босс',
        bot: 'НПС',
        [this.defaultClassName]: 'Не выбрано'
    }

    private static _classEmojies: ClassRecord = {
        knight: '🗡',
        thief: '🏹',
        sorcerer: '🪄',
        engineer: '🧤',
        bard: '🎸',
        boss: '🤡',
        bot: '🤖',
        [this.defaultClassName]: '🤷‍♂️'
    }
    
    static getEmoji(type: ClassTypes): string {
        return this._classEmojies[type]
    }

    static getName(type: ClassTypes): string {
        return this._classNames[type]
    }

    static getNames(): ClassRecord {
        return this._classNames
    }

    static getArray(): Record<ClassTypes, string[]> {
        return Object.entries(this._classNames).reduce(
            (obj, [key]) => {
                return {...obj, [key as ClassTypes]: []}
            }, 
            {} as Record<ClassTypes, string[]>
        )
    }
}