import { CallbackButtonOptions } from '../../../utils/values/types/action-options'
import NoteService from '../../db/services/notes/NoteService'
import NoteOwnerAction from './NoteOwnerAction'

export default class extends NoteOwnerAction {
    protected async _execute(options: CallbackButtonOptions<{ id: number; note: number; public?: boolean; page: number }>): Promise<string> {
        const {
            data: {
                note: noteId
            }
        } = options
        
        await NoteService.delete(noteId)
        return 'text/commands/notes/delete.pug'
    }

    constructor() {
        super()
        this._name = 'notedelete'
        this._buttonTitle = 'Заметки: Удалить'
    }
}