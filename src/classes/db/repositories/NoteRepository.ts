import Note from '../../../interfaces/schemas/notes/Note'
import NoteModel from '../models/NoteModel'
import IdRepository from './base/IdRepository'

export default new IdRepository<typeof NoteModel, Note>(NoteModel)