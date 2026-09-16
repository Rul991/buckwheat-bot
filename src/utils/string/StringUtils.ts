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
                if (!strings[lastIndex]?.length) continue

                spaceCount++

                if (spaceCount <= spaces) {
                    strings.push('')
                    continue
                }
            }

            strings[lastIndex] += symb
        }

        return strings
            .map(str => str.trim())
            .filter(str => str.length > 0)
    }

    static splitAndTrim(text: string, sep = ''): string[] {
        return text.split(sep).map(v => v.trim())
    }

    static getNumberFromString(str: string, defaultValue: number = 0): number {
        const rawNumber = +str
            .replaceAll(',', '.')
            .replaceAll(' ', '')

        if (isNaN(rawNumber)) {
            return defaultValue
        }
        else {
            return rawNumber
        }
    }
}