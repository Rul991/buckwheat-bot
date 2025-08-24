export default class StringUtils {
    static spaceRegexp = /\s+/

    static splitBySpace(text: string): string[] {
        return text
            .split(this.spaceRegexp)
    }

    static splitByCommands(text: string, spaces: number): string[] {
        let strings: string[] = ['']
        let spaceCount = 0

        for (const symb of text.trim()) {
            const lastIndex = strings.length - 1

            if(symb.match(this.spaceRegexp)) {
                if(!strings[lastIndex].length) continue
                
                spaceCount++
                
                if(spaceCount <= spaces) {
                    strings.push('')
                    continue
                }
            }

            strings[lastIndex] += symb
        }

        return strings.map(str => str.trim())
    }

    static toFormattedNumber(number: number): string {
        if(number >= 1e+21) {
            const zeroCount = Math.floor(Math.log10(number))
            const afterDot = 2
            const firstNumberPart = Math.floor(number / (10 ** (zeroCount - afterDot))) / (10 ** afterDot)

            return `${firstNumberPart} * 10^${zeroCount}`
        }
        else {
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
}