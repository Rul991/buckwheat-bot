import ChosenSkills from '../../../interfaces/schemas/duels/ChosenSkills'
import { createModel } from './modelCreators'

type Type = ChosenSkills

export default createModel<Type>({
    name: 'ChosenSkills',
    definition: {
        chatId: {
            type: Number,
            required: true
        },
        id: {
            type: Number,
            required: true
        },
        maxCount: {
            type: Number,
            required: true
        },
        skills: {
            type: [String],
            required: true
        }
    }
})