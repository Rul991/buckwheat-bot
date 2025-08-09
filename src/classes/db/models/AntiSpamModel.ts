import { model, Schema } from 'mongoose'
import AntiSpam from '../../../interfaces/schemas/AntiSpam'

type Type = AntiSpam

const spamSchema = new Schema<Type>(
    {
        id: {type: Number, required: true, unique: true},
        lastMessagesCount: {type: Number, default: 0},
        lastMessageGroupTime: {type: Number, default: 0}
    }
)

const AntiSpamModel = model<Type>('AntiSpam', spamSchema)

export default AntiSpamModel