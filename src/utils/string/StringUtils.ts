import { sanitize } from 'isomorphic-dompurify'

export default class StringUtils {
    private static _allowedTags = [
        'b', 'strong',
        'i', 'em',
        'u', 'ins',
        's', 'strike', 'del',
        'span', 'tg-spoiler',
        'code', 'pre',
        'a',
        'blockquote',
        'tg-emoji',
        'tg-time'
    ]
    private static _allowedAttrs: Record<string, string[]> = {
        'span': ['class'],
        'tg-emoji': ['emoji-id'],
        'tg-time': ['unix', 'format'],
        'blockquote': ['expandable'],
        'code': ['class'],
    }

    private static readonly _tagRegexp =
        /<\/?([\p{L}][\p{L}\p{N}:_-]*)((?:\s[^<>]*?)?)\s*\/?>/gu

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

    private static _escapeDisallowedTags(html: string): string {
        const allowed = new Set(this._allowedTags.map(t => t.toLowerCase()))

        return html.replace(this._tagRegexp, (match, tagName: string) => {
            const name = tagName.toLowerCase()

            if (allowed.has(name)) return match
            if (name.startsWith('tg-')) return match

            return match
                .replaceAll('<', '&lt;')
                .replaceAll('>', '&gt;')
        })
    }

    static sanitizeHTML(text: string): string {
        const escaped = this._escapeDisallowedTags(text)

        return sanitize(
            escaped,
            {
                ALLOWED_TAGS: this._allowedTags,
                ALLOW_SELF_CLOSE_IN_ATTR: false,
                ADD_ATTR: (attr, tag) => {
                    const allowedAttrs = this._allowedAttrs[tag]
                    return (allowedAttrs && allowedAttrs.includes(attr)) ?? false
                },
                KEEP_CONTENT: true,
                CUSTOM_ELEMENT_HANDLING: {
                    tagNameCheck: /^tg-/,
                    attributeNameCheck: (attr, tag) => {
                        return this._allowedAttrs[tag || '']?.includes(attr) ?? false
                    },
                    allowCustomizedBuiltInElements: false,
                },
            }
        )
    }
}