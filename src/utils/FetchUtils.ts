import Logging from './Logging'

export default class {
    static async text(url: string | URL, options?: RequestInit) {
        try {
            const response = await fetch(url)
            const text = await response.text()

            return text
        }
        catch(e) {
            const href = typeof url == 'string' ?
                url :
                url.href
            
            Logging.error(`Cant fetch '${href}'`, e)
            return ''
        }
    }
}