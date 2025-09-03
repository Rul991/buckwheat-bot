import LinkedChat from '../../../interfaces/schemas/LinkedChat'
import { createModel } from './modelCreators'

export default createModel<LinkedChat>({
    name: 'LinkedChat',
    definition: {
        id: { 
            type: Number, 
            required: true, 
            unique: true 
        },
        linkedChat: {
            type: Number,
            default: 0
        }
    }
})