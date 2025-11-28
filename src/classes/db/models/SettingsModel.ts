import Settings from '../../../interfaces/schemas/settings/Settings'
import { createModel } from './modelCreators'

export default createModel<Settings>(
    {
        name: 'Settings',
        definition: {
            id: {
                type: Number,
                required: true
            },
            type: {
                type: String,
                required: true
            },
            settings: {
                type: Map,
                required: true
            }
        }
    }
)