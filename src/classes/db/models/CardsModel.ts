import Cards from '../../../interfaces/schemas/card/Cards'
import InventoryCard from '../../../interfaces/schemas/card/InventoryCard'
import { createModelWithSubModel } from './modelCreators'

export default createModelWithSubModel<Cards, InventoryCard>(
    {
        id: {
            type: Number,
            required: true
        },
        count: {
            type: Number,
            required: true
        }
    },
    sub => {
        return {
            name: 'UserCards',
            definition: {
                id: {
                    type: Number,
                    required: true
                },
                chatId: {
                    type: Number,
                    required: true
                },
                cards: {
                    type: [sub],
                    required: true
                }
            }
        }
    }
)