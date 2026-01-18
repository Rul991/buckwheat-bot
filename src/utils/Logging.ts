import { mkdir } from 'fs/promises'
import FileUtils from './FileUtils'
import { join } from 'path'
import LoggingLevel from '../enums/LoggingLevel'
import { MODE } from './values/consts'

export default class Logging {
    private static _directoryPath = './logs'
    private static _loggingLevel: LoggingLevel = LoggingLevel.Log

    private static _consoleLog(level: LoggingLevel, data: any[]) {
        if(MODE == 'dev' && level <= this._loggingLevel) {
            console.log(...data)
        }
    }
    
    private static async _addMessage(type: string, level: LoggingLevel, ...data: any[]) {
        this._consoleLog(level, data)
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
        this._addMessage('warn', LoggingLevel.Warn, ...message)
    }

    static error(...message: any[]) {
        Error.stackTraceLimit = MODE == 'dev' ? 1000 : 10
        this._addMessage('error', LoggingLevel.Error,...message)
    }

    static log(...message: any[]) {
        this._addMessage('log', LoggingLevel.Log,...message)
    }

    static system(...message: any[]) {
        this._addMessage('system', LoggingLevel.System,...message)
    }
}