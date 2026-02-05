import ReplaceOptions from '../interfaces/options/ReplaceOptions'
import FileUtils from './FileUtils'
import SkillUtils from './skills/SkillUtils'

type AddCharMessageOptions = {
    value: number
    symbol: string
}

type GetAddCharHasntEffectMessageOptions = AddCharMessageOptions & {
    effect: string
}

type CharMessageWithAdditionalSymbolOptions = AddCharMessageOptions & {
    additional?: string
    filename?: string
    changeValues?: ReplaceOptions['changeValues']
}

export default class {
    private static async _getAddCharMessageWithAdditionalSymbol({
        value,
        symbol,
        additional = '',
        filename = 'add-char',
        changeValues = {}
    }: CharMessageWithAdditionalSymbolOptions) {
        const mathSymbol = value >= 0 ? '+' : '-'
        const absValue = Math.abs(value)
        return await FileUtils.readPugFromResource(
            `text/methods/${filename}.pug`,
            {
                changeValues: {
                    additional,
                    symbol,
                    absValue,
                    mathSymbol,
                    ...changeValues
                }
            }
        )
    }

    static getAddCharMessage({
        value,
        symbol
    }: AddCharMessageOptions) {
        return this._getAddCharMessageWithAdditionalSymbol({
            value,
            symbol
        })
    }

    static getAddCharPrecentsMessage({
        value,
        symbol
    }: AddCharMessageOptions) {
        return this._getAddCharMessageWithAdditionalSymbol({
            value,
            symbol,
            additional: '%'
        })
    }

    static getAddCharHasntEffectMessage({
        value,
        symbol,
        effect
    }: GetAddCharHasntEffectMessageOptions) {
        const skill = SkillUtils.getSkillById(effect)
        return this._getAddCharMessageWithAdditionalSymbol({
            value,
            symbol,
            changeValues: {
                ...skill.info
            },
            filename: 'duelist-hasnt-effect'
        })
    }
}