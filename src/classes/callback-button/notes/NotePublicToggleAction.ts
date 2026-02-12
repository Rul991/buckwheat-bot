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
        
        await NoteService.togglePublic(noteId)
        return 'text/commands/notes/toggle-public.pug'
    }

    constructor() {
        super()
        this._name = 'notepublic'
        this._buttonTitle = 'Заметки: Публичность'
    }
}