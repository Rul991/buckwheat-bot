import { BOT_TOKEN } from "../../consts/env"
import ExceptionUtils from "../exceptions/ExceptionUtils"

export default class FileUtils {
    static async downloadAsText(
        filePath?: string
    ): Promise<string | undefined> {
        if (!filePath) return undefined

        return await ExceptionUtils.handleAsync(
            async () => {
                const response = await fetch(`https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`)
                return await response.text()
            }
        )
    }
}