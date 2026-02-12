import AvaHistory from '../../../interfaces/schemas/user/AvaHistory'
import User from '../../../interfaces/schemas/user/User'
import ClassUtils from '../../../utils/ClassUtils'
import { DEFAULT_DESCRIPTION } from '../../../utils/values/consts'
import { createModelWithSubModel } from './modelCreators'

export default createModelWithSubModel<User, AvaHistory>(
    {
        imageId: { type: String, required: true },
        createdAt: { type: Number, required: true }
    },
    sub => {
        return {
            name: 'User',
            definition: {
                id: { type: Number, required: true, unique: false },
                chatId: { type: Number, required: true, unique: false },
                description: { type: String, default: DEFAULT_DESCRIPTION },
                name: { type: String, required: true },
                rank: { type: Number, default: 0 },
                imageId: { type: String, default: '' },
                className: { type: String, default: ClassUtils.defaultClassName },
                isOld: { type: Boolean, default: false },
                isLeft: { type: Boolean, default: false },
                avaHistory: { type: [sub], required: false }
            }
        }
    }
)