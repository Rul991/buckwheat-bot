import { appendFile, readdir } from 'fs/promises'
import { basename, join } from 'path'
import Logging from './Logging'
import ReplaceOptions from '../interfaces/options/ReplaceOptions'
import { render } from 'pug'
import { MODE } from './values/consts'

export default class FileUtils {
    private static _cache: Record<string, string> = {}
    private static _resourceFolder = './res/'

    static async readToString(path: string): Promise<string> {
        try {
            const file = Bun.file(path)
            const text = await file.text()

            if (MODE == 'prod') {
                this._cache[path] = text
            }

            return text
        }
        catch (e) {
            Logging.error(`Cant read text from ${path}: ${e}`)
            return ``
        }
    }

    static async write(path: string, data: string): Promise<boolean> {
        try {
            await Bun.write(path, data)
            return true
        }
        catch (e) {
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

    static async readToJson<T>(path: string): Promise<T | null> {
        try {
            const text = await this.readToString(path)
            return JSON.parse(text)
        }
        catch (e) {
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
            let result = render(
                text,
                {
                    ...(options.changeValues ?? {}),
                    filename: './res/text/.',
                    _basename: basename(path, '.pug')
                }
            )

            Logging.log({ result })
            return result
        }
        catch (e) {
            Logging.error('Pug parsing error:', e)
            return ''
        }
    }

    static async readFilesFromResourse(path: string) {
        try {
            const files = await readdir(
                join(this._resourceFolder, path),
                { withFileTypes: true }
            )
            return files
                .filter(v => v.isFile())
                .map(v => v.name)
        }
        catch (e) {
            Logging.error('Cant read directory', e)
            return []
        }
    }

    static async readJsonFromResource<T>(path: string): Promise<T | null> {
        return await this.readToJson<T>(join(this._resourceFolder, path))
    }
}