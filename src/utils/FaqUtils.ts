import { basename, join } from 'path'
import FileUtils from './FileUtils'

export default class {
    private static _directory = 'text/faq/texts/'
    private static _extension = '.pug'

    static async getFilenames(): Promise<string[]> {
        const files = await FileUtils.readFilesFromResourse(this._directory)
        return files.map(v => {
            return basename(v, this._extension)
        })
    }

    static async getText(path: string) {
        const text = await FileUtils.readPugFromResource(join(
            this._directory,
            `${path}.pug`,
        ))
        return text
    }
}