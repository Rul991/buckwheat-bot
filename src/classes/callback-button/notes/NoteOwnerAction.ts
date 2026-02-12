import { boolean, number, object, ZodType } from 'zod'
import { CallbackButtonOptions } from '../../../utils/values/types/action-options'
import CallbackButtonAction from '../CallbackButtonAction'
import MessageUtils from '../../../utils/MessageUtils'
import InlineKeyboardManager from '../../main/InlineKeyboardManager'
import NoteService from '../../db/services/notes/NoteService'
import ContextUtils from '../../../utils/ContextUtils'

type Data = {
    id: number
    note: number
    public?: boolean
    page: number
}

export default abstract class extends CallbackButtonAction<Data> {
    protected _schema: ZodType<Data> = object({
        id: number(),
        note: number(),
        public: boolean().optional(),
        page: number(),
    })

    protected abstract _execute(options: CallbackButtonOptions<Data>): Promise<string>

    async execute(options: CallbackButtonOptions<Data>): Promise<string | void> {
        const {
            ctx,
            data: {
                public: isPublic,
                page,
                note: noteId,
                id
            }
        } = options
        if(await ContextUtils.showAlertIfIdNotEqual(ctx, id)) return
        
        const path = await this._execute(options)
        await MessageUtils.editTextFromResource(
            ctx,
            path,
            {
                changeValues: {
                    note: await NoteService.get(noteId)
                },
                inlineKeyboard: await InlineKeyboardManager.get(
                    'notes/back',
                    {
                        globals: {
                            id,
                            ownerId: id,
                            p: isPublic,
                            page
                        }
                    }
                )
            }
        )
    }
}