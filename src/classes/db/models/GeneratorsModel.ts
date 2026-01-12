import Generators from '../../../interfaces/schemas/generator/Generators'
import MoneyGenerator from '../../../interfaces/schemas/generator/MoneyGenerator'
import { createModel, createModelWithSubModel } from './modelCreators'

export default createModelWithSubModel<Generators, MoneyGenerator>(
    {
        level: {
            type: Number,
            required: true
        },
        id: {
            type: Number,
            required: true
        },
    },
    sub => {
        return (
            {
                name: 'Generators',
                definition: {
                    chatId: {
                        type: Number,
                        required: true
                    },
                    id: {
                        type: Number,
                        required: true
                    },
                    lastCheckTime: {
                        type: Number,
                        required: true
                    },
                    generators: {
                        type: [sub],
                        required: true
                    }
                }
            }
        )
    }
)