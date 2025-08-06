import { model, Schema } from 'mongoose'
import Messages from '../../../interfaces/schemas/Messages'

type Type = Messages

const messagesSchema = new Schema<Type>(
    {
        id: {type: Number, required: true, unique: true},
        today: {type: Number, default: 0},
        week: {type: Number, default: 0},
        month: {type: Number, default: 0},
        total: {type: Number, default: 0},
    }
)

const MessagesModel = model<Type>('Messages', messagesSchema)

export default MessagesModel