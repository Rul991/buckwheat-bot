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