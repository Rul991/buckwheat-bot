import Messages from '../../../interfaces/schemas/Messages'
import { createModel } from './modelCreators'

export default createModel<Messages>({
    name: 'Messages',
    definition: {
        id: { type: Number, required: true, unique: true },
        total: { type: Number, default: 0 },
        firstMessage: { type: Number, default: 0 }
    }
})