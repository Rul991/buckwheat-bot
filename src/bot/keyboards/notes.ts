import type Note from "../../db/entities/notes/Note"
import KeyboardCreator from "../../utils/keyboard/KeyboardCreator"
import NoteDeleteButton from "../actions/callback-query/notes/NoteDeleteButton"
import NoteFolderScrollerButton from "../actions/callback-query/notes/NoteFolderScrollerButton"
import NoteScrollerButton from "../actions/callback-query/notes/NoteScrollerButton"

export const startNotesKeyboard = KeyboardCreator.create<{
    id: number
    owner: number
}>(
    async ({
        ctx,
        data,
        keyboard,
    }) => {
        const id = BigInt(data.id)
        const owner = BigInt(data.owner)

        keyboard
            .add(
                NoteFolderScrollerButton.button({
                    ctx,
                    data: {
                        owner,
                        data: {
                            $typeName: 'ScrollerData',
                            id,
                            data: {
                                case: 'update',
                                value: false
                            }
                        }
                    },
                    key: 'button/show'
                })
            )

        return keyboard.toFlowed(1)
    }
)

export const showNoteKeyboard = KeyboardCreator.create<{
    id: number
    note: Note
    page: number
    owner: number
}>(
    async ({
        ctx,
        data,
        keyboard
    }) => {
        const id = BigInt(data.id)
        const owner = BigInt(data.owner)
        const {
            note,
            page
        } = data
        const folderId = note.folderId

        if (id == owner) {
            keyboard
                .add(
                    NoteDeleteButton.button({
                        ctx,
                        data: {
                            id,
                            noteId: note.id
                        },
                        style: 'danger'
                    })
                )
        }

        keyboard
            .add(
                NoteScrollerButton.button({
                    ctx,
                    data: {
                        owner,
                        folderId,
                        data: {
                            $typeName: 'ScrollerData',
                            id,
                            data: {
                                case: 'page',
                                value: page
                            }
                        }
                    },
                    key: 'button/back'
                })
            )

        return keyboard.toFlowed(1)
    }
)