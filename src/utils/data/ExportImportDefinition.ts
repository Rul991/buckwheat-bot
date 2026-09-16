import type { ZodType } from "zod"
import type { BotContext } from "../../types/bot"
import type { ExportImportDefinitionVars } from "../../types/types"

type ExportOptions = {
    chatId: number
    id: number
}

type ImportOptions<T> = 
    & ExportOptions
    & {
        data: T
    }

export default class ExportImportDefinition<T> {
    id: number
    key: string
    schema: ZodType<T>
    importCallback: (options: ImportOptions<T>) => Promise<void>
    exportCallback: (options: ExportOptions) => Promise<T>

    constructor({
        id,
        key,
        schema,
        importCallback,
        exportCallback
    }: ExportImportDefinition<T>) {
        this.id = id
        this.key = key
        this.schema = schema
        this.importCallback = importCallback
        this.exportCallback = exportCallback
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