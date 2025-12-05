import ShopCard from '../../../interfaces/schemas/card/ShopCard'
import { createModel } from './modelCreators'

type Type = ShopCard

export default createModel<Type>({
    name: 'ShopCard',
    definition: {
        chatId: {
            type: Number,
            required: true
        },
        id: {
            type: Number,
            required: true,
            unique: true
        },
        card: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        seller: {
            type: Number,
            required: true
        }
    }
})