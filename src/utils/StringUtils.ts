import ReplaceOptions from '../interfaces/options/ReplaceOptions'

export default class StringUtils {
    static splitBySpace(text: string): string[] {
        return text
            .split(/\s+/)
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
}