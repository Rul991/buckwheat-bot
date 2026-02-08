import { Schema } from 'mongoose'
import Duel from '../../../interfaces/schemas/duels/Duel'
import DuelStep from '../../../interfaces/schemas/duels/DuelStep'
import Effect from '../../../interfaces/schemas/duels/Effect'
import { createModelWithSubModel } from './modelCreators'
import Characteristics from '../../../interfaces/duel/Characteristics'
import SkillAttack from '../../../enums/SkillAttack'

type Type = Duel
type SubType = DuelStep

const effectSchema = new Schema<Effect>({
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

const characteristicsSchema = new Schema<Characteristics>({
    hp: {
        type: Number,
        required: true
    },
    mana: {
        type: Number,
        required: true
    }
})

export default createModelWithSubModel<Type, SubType>(
    {
        duelist: {
            type: Number,
            required: true
        },
        attack: {
            type: Number,
            required: false,
            min: SkillAttack.Fail,
            max: SkillAttack.Crit
        },
        skill: {
            type: String,
            required: false
        },
        characteristics: {
            type: Map,
            of: characteristicsSchema,
            required: true
        },
        effects: {
            type: [effectSchema],
            required: true
        },
        startTime: {
            type: Number,
            required: false
        }
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
                steps: {
                    type: [sub],
                    required: true
                },
                bidId: {
                    type: Number,
                    required: false
                }
            }
        }
    }
)