import { boolean, number, object, ZodType } from 'zod'
import { CallbackButtonOptions } from '../../../utils/values/types/action-options'
import CallbackButtonAction from '../CallbackButtonAction'
import ContextUtils from '../../../utils/ContextUtils'
import MessageUtils from '../../../utils/MessageUtils'
import NoteService from '../../db/services/notes/NoteService'
import FileUtils from '../../../utils/FileUtils'
import InlineKeyboardManager from '../../main/InlineKeyboardManager'

type Data = {
    note: number
    id: number
    page: number
    public?: boolean
}

export default class extends CallbackButtonAction<Data> {
    protected _schema: ZodType<Data> = object({
        note: number(),
        id: number(),
        page: number(),
        public: boolean().optional(),
    })

    constructor() {
        super()
        this._name = 'note'
        this._buttonTitle = 'Заметки: Просмотр'
    }

    async execute(options: CallbackButtonOptions<Data>): Promise<string | void> {
        const {
            data,
            ctx,
            chatId
        } = options

        const {
            note: noteId,
            id,
            page,
            public: isPublic,
        } = data
        if(await ContextUtils.showAlertIfIdNotEqual(ctx, id)) return

        const note = await NoteService.get(noteId)
        if(!note) return await FileUtils.readPugFromResource(
            'text/commands/notes/no-note.pug'
        )

        const {
            text,
            owner,
            isPublic: notePublic
        } = note

        await MessageUtils.editTextFromResource(
            ctx,
            'text/commands/notes/view.pug',
            {
                changeValues: {
                    user: await ContextUtils.getUser(chatId, owner),
                    text,
                    isPublic: notePublic
                },
                inlineKeyboard: await InlineKeyboardManager.get(
                    'notes/view',
                    {
                        globals: {
                            id,
                            page,
                            isPublic,
                            owner,
                            isOwner: id == owner,
                            note: noteId
                        }
                    }
                )
            }
        )
    }
}