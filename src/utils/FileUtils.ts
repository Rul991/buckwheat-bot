import { appendFile, readFile, stat, writeFile } from 'fs/promises'
import { join } from 'path'
import FileCache from '../interfaces/other/FileCache'
import StringUtils from './StringUtils'
import Logging from './Logging'
import ReplaceOptions from '../interfaces/options/ReplaceOptions'
import { render } from 'pug'

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
            Logging.error(`Cant read text from ${path}: ${e}`)
            return ``
        }
    }

    static async write(path: string, data: string): Promise<boolean> {
        try {
            await writeFile(path, data)
            return true
        }
        catch(e) {
            Logging.error('Cant write:', e)
            return false
        }
    }

    static async append(path: string, data: string): Promise<boolean> {
        try {
            await appendFile(path, data)
            return true
        } 
        catch (e) {
            Logging.error('Cant append:', e)
            return false
        }
    }

    static async readToJson<T extends object>(path: string): Promise<T | null> {
        try {
            const text = await this.readToString(path)
            return JSON.parse(text)
        }
        catch(e) {
            Logging.warn(`Cant read json from ${path}: ${e}`)
            return null
        }
    }

    static async readPugFromResource(
        path: string, 
        options: ReplaceOptions = {}
    ): Promise<string> {
        let text = await this.readToString(join(this._resourceFolder, path))
        
        try {
            return render(
                text, 
                options.changeValues ?? {}
            )
        }
        catch(e) {
            Logging.error('Pug parsing error:', e)
            return ''
        }
    }

    static async readJsonFromResource<T extends object>(path: string): Promise<T | null> {
        return await this.readToJson<T>(join(this._resourceFolder, path))
    }
}