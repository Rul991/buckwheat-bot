import Marriage from '../../../interfaces/schemas/other/Marriage'
import { createModel } from './modelCreators'

export default createModel<Marriage>(
    {
        name: 'Marriage',
        definition: {
            id: { type: Number, required: true, unique: false },
            chatId: { type: Number, required: true, unique: false },
            startedAt: { type: Number, required: false },
            partnerId: { type: Number, required: false },
        }
    }
)