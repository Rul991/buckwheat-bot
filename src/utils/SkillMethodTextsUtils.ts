import ReplaceOptions from '../interfaces/options/ReplaceOptions'
import FileUtils from './FileUtils'
import SkillUtils from './SkillUtils'
import { UNKNOWN_EFFECT } from './values/consts'
import { ClassTypes } from './values/types'

type CharMessageWithAdditionalSymbolOptions = {
    value: number
    symbol: string
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

    static getAddCharMessage(value: number, onEnemy: boolean, symbol: string) {
        return this._getAddCharMessageWithAdditionalSymbol({
            value,
            changeValues: {
                onEnemy
            },
            symbol
        })
    }

    static getAddCharPrecentsMessage(value: number, onEnemy: boolean, symbol: string) {
        return this._getAddCharMessageWithAdditionalSymbol({
            value,
            changeValues: {
                onEnemy
            },
            symbol,
            additional: '%'
        })
    }

    static async getAddCharHasntEffectMessage(value: number, symbol: string, effect: string, type: ClassTypes) {
        const skill = await SkillUtils.getSkillById(type, effect)
        return this._getAddCharMessageWithAdditionalSymbol({
            value,
            symbol,
            changeValues: {
                title: skill?.title ?? UNKNOWN_EFFECT
            },
            filename: 'duelist-hasnt-effect'
        })
    }
}