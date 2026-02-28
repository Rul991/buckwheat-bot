import Lottery from '../../../interfaces/schemas/lottery/Lottery'
import LotteryTicket from '../../../interfaces/schemas/lottery/LotteryTicket'
import { createModelWithSubModel } from './modelCreators'

export default createModelWithSubModel<Lottery, LotteryTicket>(
    {
        prize: {
            type: Number,
            required: true
        },
        count: {
            type: Number,
            required: true
        },
    },
    sub => {
        return {
            name: 'Lottery',
            definition: {
                id: {
                    type: Number,
                    required: true,
                    unique: true
                },
                tickets: {
                    type: [sub],
                    required: true
                },
                owner: {
                    type: Number,
                    required: true
                },
                price: {
                    type: Number,
                    required: true
                },
                chatId: {
                    type: Number,
                    required: true
                },
                isPublic: {
                    type: Boolean,
                    required: true
                }
            }
        }
    }
)