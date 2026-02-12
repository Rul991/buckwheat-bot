import { number, boolean, object, ZodType } from 'zod'
import Note from '../../../interfaces/schemas/notes/Note'
import ContextUtils from '../../../utils/ContextUtils'
import FileUtils from '../../../utils/FileUtils'
import StringUtils from '../../../utils/StringUtils'
import { MAX_NOTE_PRESHOW_LENGTH } from '../../../utils/values/consts'
import { ButtonScrollerOptions, ButtonScrollerFullOptions, ButtonScrollerEditMessageResult, TinyCurrentIncreaseId } from '../../../utils/values/types/types'
import NoteService from '../../db/services/notes/NoteService'
import ButtonScrollerAction from '../scrollers/button/ButtonScrollerAction'
import { tinyCurrentIncreaseIdSchema } from '../../../utils/values/schemas'

type Object = Note
type Data = TinyCurrentIncreaseId & {
    p?: boolean
    u: number
}

export default class extends ButtonScrollerAction<Object, Data> {
    protected _filename: string = 'notes/change'
    protected _schema: ZodType<Data> = tinyCurrentIncreaseIdSchema
        .and(object({
            p: boolean().optional(),
            u: number()
        }))

    constructor () {
        super()
        this._name = 'notechange'
        this._buttonTitle = 'Заметки: Пролистывание'
    }

    protected async _getObjects({
        data: {
            p: isPublic,
            u: owner
        }
    }: ButtonScrollerOptions<Data>): Promise<Object[]> {
        return await NoteService.getAllByOwner(
            owner,
            isPublic
        )
    }

    protected async _editText({
        slicedObjects,
        data,
        chatId,
        id
    }: ButtonScrollerFullOptions<Object, Data>): Promise<ButtonScrollerEditMessageResult> {
        const {
            u: ownerId,
            p: isPublic
        } = data
        const page = this._getNewPage(data)

        return {
            text: await FileUtils.readPugFromResource(
                'text/commands/notes/change.pug',
                {
                    changeValues: {
                        user: await ContextUtils.getUser(chatId, ownerId)
                    }
                }
            ),
            values: {
                values: {
                    note: slicedObjects.map(note => {
                        const {
                            text,
                            id: noteId,
                            isPublic
                        } = note

                        const title = StringUtils.shorten(text, MAX_NOTE_PRESHOW_LENGTH)
                        const publicShow = StringUtils.getShowValue(isPublic)

                        return {
                            text: `${publicShow} ${title}`,
                            data: JSON.stringify({
                                note: noteId,
                                id,
                                page,
                                public: isPublic
                            })
                        }
                    })
                },
                globals: {
                    additional: JSON.stringify({
                        p: isPublic,
                        u: ownerId
                    })
                }
            }
        }
    }

}