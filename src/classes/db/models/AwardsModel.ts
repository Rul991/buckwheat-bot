import { createModelWithSubModel } from './modelCreators'
import Awards from '../../../interfaces/schemas/Awards'
import Award from '../../../interfaces/schemas/Award'

type Type = Awards
type SubType = Award

export default createModelWithSubModel<Type, SubType>({
        text: { type: String, required: true },
        rank: { type: Number, required: true },
    },
    sub => {
        return {
            name: 'Awards',
            definition: {
                id: { type: Number, required: true },
                chatId: { type: Number, required: true },
                awards: { type: [sub], default: [] }
            }
        }
    }
)