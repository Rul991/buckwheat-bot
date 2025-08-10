import { model, Schema } from 'mongoose'
import Chat from '../../../interfaces/schemas/Chat'

type Type = Chat

const chatSchema = new Schema<Type>(
    {
        rules: {type: Array<string>, of: String, default: []},
        hello: {type: String, default: ''}
    }
)

const ChatModel = model<Type>('Chat', chatSchema)

export default ChatModel