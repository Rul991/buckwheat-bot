import Level from '../../../interfaces/schemas/user/Level'
import { createModel } from './modelCreators'

export default createModel<Level>({
    name: 'Level',
    definition: {
        id: { type: Number, required: true, unique: false },
        chatId: { type: Number, required: true, unique: false },
        experience: {type: Number, default: 0}
    }
})