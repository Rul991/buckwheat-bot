import type { LogLevel } from "../../types/logs"
import { IS_PROD } from "../../consts/env"
import { appendFile } from "node:fs/promises"

type LogOptions = {
    level: LogLevel
    message: any[]
    callback?: (...args: any) => any
}

export default class Logger {
    private static readonly _maxSize: number = 25 * 1024 * 1024
    private static _levels: LogLevel[] = IS_PROD ?
        ['error', 'log'] :
        ['debug', 'error', 'log', 'warn']

    private static async _logToFile({
        level,
        message,
    }: LogOptions): Promise<void> {
        const values = message
            .map(v => Bun.inspect(v, { compact: true, colors: false, depth: 10 }).replaceAll('\n', ' '))
            .join(' ')

        const line = `${new Date().toUTCString()} | ${values}\n`
        const path = `logs/${level}.log`

        const file = Bun.file(path)
        const stats = await (async () => {
            try {
                return await file.stat()
            }
            catch {
                return undefined
            }
        })()
        const isDelete = (stats?.size ?? 0) >= this._maxSize
        
        if(isDelete) {
            file.unlink().catch(() => null)
        }

        appendFile(
            path,
            line
        )
    }

    private static _log(options: LogOptions): void {
        const {
            level,
            message,
            callback = console.log
        } = options

        try {
            this._logToFile(options)
            if (this._levels.includes(level)) {
                callback(...message)
            }
        }
        catch (e) {
            console.error('Logger._log', e)
        }
    }

    static error(...message: any[]) {
        this._log({
            level: 'error',
            message,
            callback: console.error
        })
    }

    static log(...message: any[]) {
        this._log({
            level: 'log',
            message,
        })
    }

    static warn(...message: any[]) {
        this._log({
            level: 'warn',
            message,
            callback: console.warn
        })
    }

    static debug(...message: any[]) {
        this._log({
            level: 'debug',
            message,
        })
    }

    static system(...message: any[]) {
        this._log({
            level: 'system',
            message,
        })
    }
}