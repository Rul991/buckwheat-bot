import type { DeleteResult } from "mongoose"
import ExportImportData from "../../entities/export-import/ExportImportData"
import BaseService from "../base/BaseService"

class ExportImportDataService extends BaseService<typeof ExportImportData> {
    constructor() {
        super(ExportImportData)
    }

    async get(key: string, hash: string): Promise<ExportImportData | undefined> {
        return await this._repo.findOne({
            hash,
            key
        })
    }

    async delete(key: string, hash: string): Promise<DeleteResult> {
        return await this._repo.deleteOne({
            hash,
            key
        })
    }
}

export default new ExportImportDataService()