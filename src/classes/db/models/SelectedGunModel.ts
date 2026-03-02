import SelectedGun from '../../../interfaces/schemas/gun/SelectedGun'
import { createModel } from './modelCreators'

export default createModel<SelectedGun>({
    name: 'SelectedGun',
    definition: {
        chatId: {
            type: Number,
            required: true
        },
        id: {
            type: Number,
            required: true
        },
        gunId: {
            type: String,
            required: false
        }
    }
})