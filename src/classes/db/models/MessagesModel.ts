import { model, Schema } from 'mongoose'
import Messages from '../../../interfaces/schemas/Messages'

type Type = Messages

const messagesSchema = new Schema<Type>(
    {
        id: {type: Number, required: true, unique: true},
        total: {type: Number, default: 0},
    }
)

const MessagesModel = model<Type>('Messages', messagesSchema)

export default MessagesModel