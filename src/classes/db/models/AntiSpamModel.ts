import AntiSpam from '../../../interfaces/schemas/other/AntiSpam'
import { createModel } from './modelCreators'

export default createModel<AntiSpam>({
    name: 'AntiSpam',
    definition: {
        id: { 
            type: Number, 
            required: true, 
            unique: true 
        },
        lastMessagesCount: {
            type: Number,
            default: 0
        },
        lastMessageGroupTime: {
            type: Number,
            default: 0,
        }
    }
})