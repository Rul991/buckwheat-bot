import Note from "../../entities/notes/Note"
import BaseService from "../base/BaseService"

class NoteService extends BaseService<typeof Note> {
    constructor() {
        super(Note)
    }
}

export default new NoteService()