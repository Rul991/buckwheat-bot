import Chat from '../../../interfaces/schemas/Chat'
import { createModel } from './modelCreators'

export default createModel<Chat>({
    name: 'Chat',
    definition: {
        id: {
            type: Number,
            required: true,
            unique: true
        },
        rules: {
            type: Array<string>,
            of: String,
            default: []
        },
        hello: {
            type: String,
            default: ''
        }
    }
})