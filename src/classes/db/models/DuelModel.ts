import { Schema } from 'mongoose'
import Duel from '../../../interfaces/schemas/duels/Duel'
import DuelStep from '../../../interfaces/schemas/duels/DuelStep'
import Effect from '../../../interfaces/schemas/duels/Effect'
import { createModelWithSubModel } from './modelCreators'
import LastStep from '../../../interfaces/schemas/duels/LastStep'

type Type = Duel
type SubType = DuelStep
type SubSubType = LastStep
type SecondSubType = Effect

const secondSubSchema = new Schema<SecondSubType>({
    name: {
        type: String,
        required: true
    },
    remainingSteps: {
        type: Number,
        required: true
    },
    sender: {
        type: Number,
        required: true
    },
    target: {
        type: Number,
        required: true
    },
})

const subSubSchema = new Schema<SubSubType>({
    duelist: {
        type: Number,
        required: true
    },
    skill: {
        type: String,
        required: false,
    }
})

export default createModelWithSubModel<Type, SubType>(
    {
        duelist: {
            type: Number,
            required: true
        },
        lastStep: {
            type: subSubSchema,
            required: true
        },
    },
    sub => {
        return {
            name: 'Duel',
            definition: {
                id: {
                    type: Number,
                    required: true,
                    unique: true,
                },
                chatId: {
                    type: Number,
                    required: true
                },
                firstDuelist: {
                    type: Number,
                    required: true
                },
                secondDuelist: {
                    type: Number,
                    required: true
                },
                step: {
                    type: sub,
                    required: true
                },
                bidId: {
                    type: Number,
                    required: false
                },
                effects: {
                    type: [secondSubSchema],
                    default: []
                },
                steps: {
                    type: Number,
                    default: 0
                }
            }
        }
    }
)