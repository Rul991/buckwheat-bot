import { readdir } from "node:fs/promises"
import Logger from "../logs/Logger"
import { join } from "node:path"
import { access } from "node:fs/promises"
import type { BotContext } from "../../types/bot"

export default class FaqUtils {
    private static readonly _rootFolder = 'locales/ru/faq/articles'
    private static readonly _rootKey = 'faq/articles'
    private static readonly _textKey = 'text'
    private static readonly _titleKey = 'title'
    private static readonly _extension = 'pug'
    private static _faqKeys = [] as string[]

    static async setup(): Promise<string[]> {
        this._faqKeys = []
        try {
            for (const dirent of await readdir(this._rootFolder, { withFileTypes: true })) {
                const isFolder = dirent.isDirectory()
                if (!isFolder) continue

                const path = join(dirent.parentPath, dirent.name)
                const textPath = join(path, `${this._textKey}.${this._extension}`)
                const titlePath = join(path, `${this._titleKey}.${this._extension}`)

                try {
                    await access(textPath)
                    await access(titlePath)
                }
                catch {
                    continue
                }

                this._faqKeys.push(dirent.name)
            }
        }
        catch (e) {
            Logger.error('FaqUtils.setup', e)
        }

        Logger.debug('FaqUtils.setup', this._faqKeys)
        return this._faqKeys
    }

    static getAll(): string[] {
        return this._faqKeys
    }

    static get(index: number): string | undefined {
        return this._faqKeys[index]
    }

    static getVars(ctx: BotContext, index: number) {
        const key = this.get(index)
        if(!key) return undefined

        return {
            title: ctx.t(`${this._rootKey}/${key}/${this._titleKey}`),
            text: ctx.t(`${this._rootKey}/${key}/${this._textKey}`),
        }
    }

    static getTitle(ctx: BotContext, index: number) {
        const key = this.get(index)
        if(!key) return undefined
        return ctx.t(`${this._rootKey}/${key}/${this._titleKey}`)
    }
}