import { model, Schema } from 'mongoose'
import IKeyboardSchema from '../../../interfaces/schemas/keyboard/KeyboardSchema'
import { DB_KEYBOARD_EXPIRES_SECONDS } from '../../../utils/values/consts'

type Data = IKeyboardSchema

const KeyboardSchema = new Schema<Data>({
    id: { 
        type: Number,
        required: true
    },
    chatId: { 
        type: Number,
        required: true
    },
    messageId: { 
        type: Number,
        required: true
    },
    keyboard: { 
        type: [[String]],
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    }
})

KeyboardSchema.index(
    {
        createdAt: 1
    },
    {
        expireAfterSeconds: DB_KEYBOARD_EXPIRES_SECONDS
    }
)

const KeyboardModel = model<typeof KeyboardSchema>('Keyboard', KeyboardSchema)
export default KeyboardModel