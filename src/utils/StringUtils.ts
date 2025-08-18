import ReplaceOptions from '../interfaces/options/ReplaceOptions'

export default class StringUtils {
    private static _spaceRegexp = /\s+/

    static splitBySpace(text: string): string[] {
        return text
            .split(this._spaceRegexp)
    }

    static splitByCommands(text: string, spaces: number): string[] {
        let strings: string[] = ['']
        let spaceCount = 0

        for (const symb of text.trim()) {
            if(symb.match(this._spaceRegexp)) {
                spaceCount++
                if(spaceCount <= spaces) {
                    strings.push('')
                    continue
                }
            }

            strings[strings.length - 1] += symb
        }

        return strings
    }

    static replaceLocalsInText(
        text: string, 
        {isParseToHtmlEntities = true, changeValues = {}}: ReplaceOptions
    ): string {
        for (const key in changeValues) {
            text = text.replaceAll(
                `$${key}`, 
                this.toHtmlEntitiesIfNeed(
                    changeValues[key],
                    isParseToHtmlEntities
                )
            )
        }

        return text
    }

    static toHtmlEntitiesIfNeed(text: any, need = true): string {
        return need && typeof text == 'string' ? StringUtils.toHtmlEntities(text) : text
    }

    static toHtmlEntities(string: string): string {
        return string
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            ?? ''
    }

    static validate(string: string): string {
        return string
            .replaceAll(/[&<>]/g, '')
    }

    static toFormattedNumber(number: number): string {
        return number
            .toString()
            .split('')
            .reverse()
            .reduce((prev, curr, i, arr) => {
                let newSegment: string = curr
                if(i > 0 && (i + 1) % 3 == 0 && i != arr.length - 1) {
                    newSegment = ' ' + newSegment
                }

                return newSegment + prev
            }, '')
    }
}