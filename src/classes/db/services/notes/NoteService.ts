import Note from '../../../../interfaces/schemas/notes/Note'
import StringUtils from '../../../../utils/StringUtils'
import { MAX_NOTE_LENGTH } from '../../../../utils/values/consts'
import NoteRepository from '../../repositories/NoteRepository'
import UserSettingsService from '../settings/UserSettingsService'

type CreateNote = Omit<Note, 'id' | 'isPublic'>

export default class {
    static async create(note: CreateNote) {
        const {
            owner
        } = note

        const id = await NoteRepository.getMaxId() + 1
        const isPublic = await UserSettingsService.get<'boolean'>(
            owner,
            'notesPublic'
        )

        return await NoteRepository.create(
            {
                ...note,
                id,
                isPublic
            }
        )
    }

    static async add(owner: number, raw: string) {
        const text = StringUtils.shorten(
            raw,
            MAX_NOTE_LENGTH
        )

        await this.create({
            text,
            owner
        })
        return text
    }

    static async get(id: number) {
        return await NoteRepository.findOne(id)
    }

    static async delete(id: number) {
        return await NoteRepository.deleteOne(id)
    }

    static async getAllByOwner(owner: number, isPublic?: boolean) {
        return await NoteRepository.findMany({
            owner,
            ...(
                isPublic ?
                    { isPublic } :
                    {}
            )
        })
    }

    static async togglePublic(id: number) {
        const note = await this.get(id)
        if (!note) return false

        const newPublic = !note.isPublic

        await NoteRepository.updateOne(
            id,
            {
                isPublic: newPublic
            }
        )

        return newPublic
    }
}