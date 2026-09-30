import type { BotContext } from "../../types/bot"
import type { ClassRecord, ClassTypes, ClassVars, VisibleClassRecord } from "../../types/class"

export default class ClassUtils {
    static readonly defaultClassName = 'unknown'
    static readonly nonPlayerClassNames: ClassTypes[] = [this.defaultClassName, 'bot']
    static readonly playerClassNames: ClassTypes[] = ['bard', 'engineer', 'knight', 'sorcerer', 'thief', 'boss']
    static readonly changeableClassNames: ClassTypes[] = ['knight', 'thief', 'sorcerer', 'engineer', 'bard']
    static readonly classNames: ClassTypes[] = [...this.nonPlayerClassNames, ...this.playerClassNames]

    private static readonly _visibleClassNames: VisibleClassRecord = {
        knight: 'knight',
        thief: 'thief',
        sorcerer: 'sorcerer',
        engineer: 'engineer',
        bard: 'bard',
    }

    private static readonly _classNames: ClassRecord = {
        ...this._visibleClassNames,
        bot: 'bot',
        boss: 'boss',
        [this.defaultClassName]: this.defaultClassName
    }

    static getType(classType: ClassTypes): string {
        return this._classNames[classType] || this._classNames[this.defaultClassName]
    }

    static getEmoji(ctx: BotContext, classType: ClassTypes): string {
        const type = this.getType(classType)
        return ctx.t('classes/emoji', { type })
    }

    static getName(ctx: BotContext, classType: ClassTypes): string {
        const type = this.getType(classType)
        return ctx.t(`classes/name`, { type })
    }

    static getVars(ctx: BotContext, classType: ClassTypes = ClassUtils.defaultClassName): ClassVars {
        return {
            name: this.getName(ctx, classType),
            emoji: this.getEmoji(ctx, classType)
        }
    }

    static getChangeableClassNames(): ClassTypes[] {
        return Array.from(this.changeableClassNames)
    }

    static isPlayer(type: ClassTypes | undefined) {
        if(!type) return false
        return ClassUtils.playerClassNames.some(v => v == type)
    }

    static canCraft(type: ClassTypes): boolean {
        return type == 'engineer' || type == 'boss'
    }
}