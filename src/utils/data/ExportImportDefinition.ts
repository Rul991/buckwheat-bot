import type { ZodType } from "zod"
import type { BotContext } from "../../types/bot"
import type { ExportImportDefinitionVars } from "../../types/types"

type ExportOptions = {
    chatId: number
    id: number
    ctx: BotContext
}

type ImportOptions<T> = 
    & ExportOptions
    & {
        data: T
    }

type ContructorOptions<T> = 
    & Omit<ExportImportDefinition<T>, 'getVars' | 'forChat'>
    & Partial<Pick<ExportImportDefinition<T>, 'forChat'>>

export default class ExportImportDefinition<T> {
    id: number
    key: string
    forChat: boolean
    schema: ZodType<T>
    importCallback: (options: ImportOptions<T>) => Promise<boolean>
    exportCallback: (options: ExportOptions) => Promise<T>

    constructor({
        id,
        key,
        schema,
        importCallback,
        exportCallback,
        forChat = true
    }: ContructorOptions<T>) {
        this.id = id
        this.key = key
        this.schema = schema
        this.importCallback = importCallback
        this.exportCallback = exportCallback
        this.forChat = forChat
    }

    getVars(ctx: BotContext): ExportImportDefinitionVars {
        const startPath = 'export-import'
        
        const title = ctx.t(`${startPath}/${this.key}/title`)
        const description = ctx.t(`${startPath}/${this.key}/description`)
        const emoji = ctx.t(`${startPath}/${this.key}/emoji`)

        return {
            title,
            description,
            emoji
        }
    }
}