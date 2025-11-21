import Roleplays from '../../../interfaces/schemas/chat/Roleplays'
import { createModel } from './modelCreators'

export default createModel<Roleplays>({
    name: 'Roleplays',
    definition: {
        id: { type: Number, required: true, unique: true },
        commands: { type: [[String]], default: []}
    }
})