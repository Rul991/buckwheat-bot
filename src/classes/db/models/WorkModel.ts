import Work from '../../../interfaces/schemas/Work'
import { createModel } from './modelCreators'

export default createModel<Work>({
    name: 'Work',
    definition: {
        id: { type: Number, required: true, unique: false },
        chatId: { type: Number, required: true, unique: false },
        lastWork: {type: Number, default: 0}
    }
})