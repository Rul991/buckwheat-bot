import { existsSync } from 'fs'
import { mkdir, writeFile } from 'fs/promises'
import FileUtils from './FileUtils'
import { join } from 'path'

export default class Logging {
    private static _directoryPath = './logs'
    
    private static async _addMessage(type: string, ...data: any[]) {
        await mkdir(this._directoryPath, {recursive: true})

        const now = new Date()

        const message = data.map(val => 
            JSON.stringify(val ?? null)
        ).join(' ')
        
        await FileUtils.append(
            join(this._directoryPath, `${type}.log`),
            `[${now.toUTCString()}] ${message}\n`
        )
    }

    static warn(...message: any[]) {
        this._addMessage('warn', ...message)
    }

    static error(...message: any[]) {
        console.error(...message)
        this._addMessage('error', ...message)
    }

    static log(...message: any[]) {
        this._addMessage('log', ...message)
    }
}