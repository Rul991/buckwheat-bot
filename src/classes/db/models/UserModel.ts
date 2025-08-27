import User from '../../../interfaces/schemas/User'
import ClassUtils from '../../../utils/ClassUtils'
import { createModel } from './modelCreators'

export default createModel<User>({
    name: 'User',
    definition: {
        id: { type: Number, required: true, unique: true },
        description: { type: String, default:  ''},
        name: { type: String, required: true },
        rank: { type: Number, default: 0 },
        imageId: { type: String, default:  ''},
        className: { type: String, default: ClassUtils.defaultClassName },
        isOld: { type: Boolean, default: false },
        linkedChat: { type: Number, default: 0 },
        isLeft: { type: Boolean, default: false }
    }
})