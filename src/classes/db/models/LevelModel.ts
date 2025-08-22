import Level from '../../../interfaces/schemas/Level'
import { createModel } from './modelCreators'

export default createModel<Level>({
    name: 'Level',
    definition: {
        id: {type: Number, required: true, unique: true},
        experience: {type: Number, default: 0}
    }
})