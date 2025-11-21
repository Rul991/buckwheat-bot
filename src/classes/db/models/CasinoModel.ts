import Casino from '../../../interfaces/schemas/games/Casino'
import { START_MONEY } from '../../../utils/values/consts'
import { createModel } from './modelCreators'

export default createModel<Casino>({
    name: 'Casino',
    definition: {
        id: { 
            type: Number, 
            required: true, 
            unique: false
        },
        chatId: {
            type: Number,
            required: true,
            unique: false
        },
        loses: {
            type: Number,
            default: 0
        },
        wins: {
            type: Number,
            default: 0
        },
        money: {
            type: Number,
            default: START_MONEY
        }
    }
})