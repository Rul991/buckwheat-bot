import Duelist from '../../../interfaces/schemas/duels/Duelist'
import { createModel } from './modelCreators'

export default createModel<Duelist>({
    name: 'Duelist',
    definition: {
        chatId: {
            type: Number,
            required: true
        },
        id: {
            type: Number,
            required: true
        },
        hp: {
            type: Number,
            required: true
        },
        mana: {
            type: Number,
            required: true
        },
        onDuel: {
            type: Boolean,
            default: false
        },
        lastSave: {
            type: Number,
            required: false
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