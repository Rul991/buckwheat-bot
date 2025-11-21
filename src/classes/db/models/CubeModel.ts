import Cube from '../../../interfaces/schemas/games/Cube'
import { createModel } from './modelCreators'

export default createModel<Cube>({
    name: 'Cube',
    definition: {
        id: { 
            type: Number, 
            required: true, 
        },
        chatId: {
            type: Number,
            required: true,
        },
        wins: {
            type: Number,
            default: 0
        },
        loses: {
            type: Number,
            default: 0
        },
        lastMessage: {
            type: Number,
            required: false
        }
    }
})