import { Progress } from './values/types/types'

export default class StringUtils {
    static spaceRegexp = /\s+/

    static splitBySpace(text: string, limit?: number): string[] {
        return text
            .split(this.spaceRegexp, limit)
    }

    static splitByCommands(text: string, spaces: number): string[] {
        let strings: string[] = ['']
        let spaceCount = 0

        for (const symb of text.trim()) {
            const lastIndex = strings.length - 1

            if (symb.match(this.spaceRegexp)) {
                if (!strings[lastIndex].length) continue

                spaceCount++

                if (spaceCount <= spaces) {
                    strings.push('')
                    continue
                }
            }

            strings[lastIndex] += symb
        }

        return strings.map(str => str.trim())
    }

    static splitAndTrim(text: string, sep = ''): string[] {
        return text.split(sep).map(v => v.trim())
    }

    static getShowValue(value: any) {
        if (typeof value == 'boolean') {
            return value ? '✅' : '❌'
        }
        else if (typeof value == 'number') {
            return this.toFormattedNumber(value)
        }
        else if(value instanceof Array) {
            return value.reduce(
                (prev, curr, i) => {
                    const separator = i + 1 < value.length ? ', ' : ''
                    const showValue = this.getShowValue(curr)
                    return `${prev}${separator}${showValue}`
                },
                ''
            )
        }
        else {
            return `${value}`
        }
    }

    static toFormattedNumber(number: number, separator = ' '): string {
        if (number >= 1e+21) {
            const zeroCount = Math.floor(Math.log10(number))
            const afterDot = 2
            const firstNumberPart = Math.floor(number / (10 ** (zeroCount - afterDot))) / (10 ** afterDot)

            return `${firstNumberPart} * 10^${zeroCount}`
        }
        else {
            let symbolsCount = 0
            return [...number.toString()]
                .reverse()
                .reduce((prev, curr) => {
                    if (curr != '.' && curr != '-') {
                        symbolsCount++
                    }
                    else {
                        symbolsCount = -1
                    }

                    if (symbolsCount > 0 && symbolsCount % 3 == 0) {
                        return `${curr}${separator}${prev}`
                    }

                    return `${curr}${prev}`
                })
        }
    }

    static getProgress({
        symbols: { half, full, empty, maxCount },
        progress: { current, max },
    }: Progress): string {
        const rawSymbolCount = current / max * maxCount
        const symbolsCount = (rawSymbolCount - (rawSymbolCount % 0.5))

        const fullSymbolsCount = Math.floor(symbolsCount)
        const hasHalf = Boolean(symbolsCount % 1)

        return current > 0 ?
            `${full.repeat(Math.min(fullSymbolsCount, maxCount - +hasHalf))}${hasHalf ? half : ''}` :
            empty
    }

    static getProgressWithNums(progress: Progress): string {
        const { current, max } = progress.progress
        return `${this.getProgress(progress)} (${current} / ${max})`
    }

    static getNumberFromString(str: string): number {
        const rawNumber = +str
            .replaceAll(',', '.')
            .replaceAll(' ', '')

        if (isNaN(rawNumber)) {
            return 0
        }
        else {
            return rawNumber
        }
    }
}