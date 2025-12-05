import Card from '../../../interfaces/schemas/card/Card'
import { createModel } from './modelCreators'

export default createModel<Card>({
    name: 'Card',
    definition: {
        id: {
            type: Number,
            required: true,
            unique: true
        },
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        rarity: {
            type: Number,
            required: true
        },
        isSuggested: {
            type: Boolean,
            required: true
        }
    }
})