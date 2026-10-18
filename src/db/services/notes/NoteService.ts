import Note from "../../entities/notes/Note"
import BaseService from "../base/BaseService"

class NoteService extends BaseService<typeof Note> {
    constructor() {
        super(Note)
    }

    async get(noteId: number) {
        return await this._repo.findOne({
            id: noteId
        })
    }

    async delete(noteId: number) {
        const result = await this._repo.deleteOne({
            id: noteId
        })
        return result.deletedCount > 0
    }

    async deleteByFolder(folderId: number) {
        const result = await this._repo.deleteMany({
            folderId
        })
        return result.deletedCount > 0
    }

    async getAllByFolder(folderId: number) {
        return await this._repo.find({
            folderId
        })
    }
}

export default new NoteService()