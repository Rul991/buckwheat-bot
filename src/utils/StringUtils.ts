export default class StringUtils {
    static splitBySpace(text: string): string[] {
        return text
            .split(/\s+/)
    }

    static toHtmlEntities(string: string): string {
        return string
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
    }

    static validate(string: string): string {
        return string
            .replaceAll(/[&<>]/g, '')
    }
}