import Ideas from '../../../interfaces/schemas/Ideas'
import Idea from '../../../interfaces/schemas/Idea'
import { createModelWithSubModel } from './modelCreators'

type Type = Ideas
type SubType = Idea

export default createModelWithSubModel<Type, SubType>({
        name: { type: String, required: true },
        text: { type: String, required: true },
        voters: { type: [Number], default: [] },
        coolVote: { type: Number, default: 0 },
        badVote: { type: Number, default: 0},
        createdAtTime: { type: Number, default: 0},
    },
    sub => {
        return {
            name: 'Ideas',
            definition: {
                ideas: { type: [sub], default: [] }
            }
        }
    }
)