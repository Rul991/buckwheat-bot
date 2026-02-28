import { model, Schema } from 'mongoose'
import CacheScrollerObjects from '../../../interfaces/schemas/keyboard/CacheScrollerObjects'
import { CACHE_SCROLLER_OBJECTS_EXPIRES_SECOND, DB_KEYBOARD_EXPIRES_SECONDS } from '../../../utils/values/consts'

const schema = new Schema<CacheScrollerObjects>({
    messageId: {
        type: Number,
        required: true
    },
    chatId: {
        type: Number,
        required: true
    },
    objects: {
        type: [],
        required: true
    },
    updatedAt: {
        type: Date,
        required: false
    }
})

schema.index(
    {
        updatedAt: 1
    },
    {
        expireAfterSeconds: CACHE_SCROLLER_OBJECTS_EXPIRES_SECOND
    }
)

const CacheScrollersObjectsModel = model<typeof schema>(
    'CacheScrollerObjects',
    schema
)
export default CacheScrollersObjectsModel