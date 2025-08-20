import { model, Schema } from 'mongoose'
import Ideas from '../../../interfaces/schemas/Ideas'
import Idea from '../../../interfaces/schemas/Idea'

type Type = Ideas
type SubType = Idea

const ideaSchema = new Schema<SubType>({
    name: { type: String, required: true },
    text: { type: String, required: true },
    voters: { type: [Number], default: [] },
    coolVote: { type: Number, default: 0 },
    badVote: { type: Number, default: 0},
    createdAtTime: { type: Number, default: 0},
})

const ideasSchema = new Schema<Type>(
    {
        ideas: { type: [ideaSchema], default: [] }
    }
)

const IdeasModel = model<Type>('Ideas', ideasSchema)

export default IdeasModel