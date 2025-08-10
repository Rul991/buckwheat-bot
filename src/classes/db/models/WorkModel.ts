import { model, Schema } from 'mongoose'
import Work from '../../../interfaces/schemas/Work'

type Type = Work

const schema = new Schema<Type>(
    {
        id: {type: Number, required: true, unique: true},
        lastWork: {type: Number, default: 0}
    }
)

const WorkModel = model<Type>('Work', schema)

export default WorkModel