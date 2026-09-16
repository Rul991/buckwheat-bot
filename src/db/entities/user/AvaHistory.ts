import { prop } from "@typegoose/typegoose"
import BaseEntity from "../base/BaseEntity"
import type { AvaHistoryType } from "../../../types/types"

export default class AvaHistory extends BaseEntity {
    @prop()
    fileId: string
    @prop()
    createdAt: Date

    @prop({ type: String })
    type: AvaHistoryType

    constructor({
        fileId: imageId,
        createdAt,
        type
    }: Omit<AvaHistory, '_id' | 'createdAt' | 'type'> & Partial<Pick<AvaHistory, 'createdAt' | 'type'>>) {
        super()

        this.fileId = imageId
        this.createdAt = createdAt ?? new Date
        this.type = type ?? 'image'
    }
}