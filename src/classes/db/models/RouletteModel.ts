import Roulette from '../../../interfaces/schemas/games/Roulette'
import { createModel } from './modelCreators'

export default createModel<Roulette>({
    name: 'Roulette',
    definition: {
        id: { type: Number, required: true },
        chatId: { type: Number, required: true },
        winStreak: { type: Number, default: 0 },
        maxWinStreak: { type: Number, default: 0 },
    }
})