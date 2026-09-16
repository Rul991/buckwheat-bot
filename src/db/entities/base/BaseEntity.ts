import type { mongoose } from "@typegoose/typegoose"

export default abstract class BaseEntity {
    _id?: mongoose.Types.ObjectId
}