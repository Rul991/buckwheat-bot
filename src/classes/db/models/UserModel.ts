import User from '../../../interfaces/schemas/user/User'
import ClassUtils from '../../../utils/ClassUtils'
import { DEFAULT_DESCRIPTION } from '../../../utils/values/consts'
import { createModel } from './modelCreators'

export default createModel<User>({
    name: 'User',
    definition: {
        id: { type: Number, required: true, unique: false },
        chatId: { type: Number, required: true, unique: false },
        description: { type: String, default: DEFAULT_DESCRIPTION},
        name: { type: String, required: true },
        rank: { type: Number, default: 0 },
        imageId: { type: String, default:  ''},
        className: { type: String, default: ClassUtils.defaultClassName },
        isOld: { type: Boolean, default: false },
        isLeft: { type: Boolean, default: false }
    }
})