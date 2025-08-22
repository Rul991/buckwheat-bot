import Chat from '../../../interfaces/schemas/Chat'
import { createModel } from './modelCreators'

export default createModel<Chat>({
    name: 'Chat',
    definition: {
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