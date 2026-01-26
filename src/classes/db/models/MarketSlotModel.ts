import MarketSlot from '../../../interfaces/schemas/market/MarketSlot'
import { createModel } from './modelCreators'

export default createModel<MarketSlot>({
    name: 'MarketSlot',
    definition: {
        chatId: {
            type: Number,
            required: true
        },
        userId: {
            type: Number,
            required: true
        },
        id: {
            type: Number,
            required: true
        },
        itemId: {
            type: String,
            required: true
        },
        count: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
    }
})