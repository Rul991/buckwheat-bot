import Note from '../../../interfaces/schemas/notes/Note'
import { createModel } from './modelCreators'

export default createModel<Note>({
    name: 'Note',
    definition: {
        id: {
            type: Number,
            required: true,
            unique: true
        },
        owner: {
            type: Number,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        isPublic: {
            type: Boolean,
            required: true
        }
    }
})