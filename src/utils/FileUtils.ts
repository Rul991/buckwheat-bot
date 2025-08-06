import { readFile, stat } from 'fs/promises'
import { join } from 'path'
import FileCache from '../interfaces/other/FileCache'
import StringUtils from './StringUtils'

export default class FileUtils {
    private static _cache: Record<string, FileCache> = {}
    private static _resourceFolder = './res/'

    static async readToString(path: string): Promise<string> {
        try {
            let isCached = false
            const cachedValue = this._cache[path] ?? {}

            const stats = await stat(path)
            if(stats.ctimeMs == cachedValue.lastEdited) {
                isCached = true
            }
            else {
                cachedValue.lastEdited = stats.ctimeMs
            }

            let result: string

            if(isCached) {
                result = cachedValue.text
            }
            
            else {
                const buffer = await readFile(path)
                result = buffer.toString()
            }

            cachedValue.text = result
            this._cache[path] = cachedValue

            return result
        }
        catch(e) {
            console.error(`cant read text from ${path}: ${e}`)
            return ``
        }
    }

    static async readToJson<T extends object>(path: string): Promise<T | null> {
        try {
            const text = await this.readToString(path)
            return JSON.parse(text)
        }
        catch(e) {
            console.warn(`cant read json from ${path}: ${e}`)
            return null
        }
    }

    static async readTextFromResource(
        path: string, 
        changeValues: Record<string, string> = {}, 
        isParseToHtmlEntities = true
    ): Promise<string> {
        let text = await this.readToString(join(this._resourceFolder, path))

        for (const key in changeValues) {
            const replacedText = isParseToHtmlEntities ? StringUtils.toHtmlEntities(changeValues[key]) : changeValues[key]
            text = text.replaceAll(`$${key}`, replacedText)
        }

        return text
    }

    static async readJsonFromResource<T extends object>(path: string): Promise<T | null> {
        return await this.readToJson<T>(join(this._resourceFolder, path))
    }
}