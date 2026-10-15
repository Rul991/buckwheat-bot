import { index, prop, Severity } from "@typegoose/typegoose"
import BaseEntity from "../base/BaseEntity"
import { EXPORT_IMPORT_DATA_TTL } from "../../../consts/time"
import { randomBytes } from "node:crypto"

@index(
    {
        createdAt: 1
    },
    {
        expireAfterSeconds: EXPORT_IMPORT_DATA_TTL
    }
)
@index(
    {
        hash: 1,
        key: 1
    }
)
export default class ExportImportData extends BaseEntity {
    static createHash(): string {
        return randomBytes(24).toString('hex')
    }

    @prop({ unique: true })
    hash: string

    @prop({ allowMixed: Severity.ALLOW })
    values: any

    @prop()
    key: string

    @prop()
    createdAt: Date

    constructor(key: string, values: any) {
        super()
        this.hash = ExportImportData.createHash()
        this.createdAt = new Date()
        this.values = values
        this.key = key
    }
}