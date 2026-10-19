import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { InlineKeyboard } from "grammy"
import { type NoteScrollerButtonData, NoteScrollerButtonDataSchema } from "../../../../protos/notes_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { ScrollerButtonEditMessageOptions } from "../../../../types/options"
import type { ScrollerButtonEditMessageResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import ScrollerButton from "../scroller/ScrollerButton"
import type Note from "../../../../db/entities/notes/Note"
import NoteService from "../../../../db/services/notes/NoteService"
import NoteFolderService from "../../../../db/services/notes/NoteFolderService"
import UserService from "../../../../db/services/user/UserService"
import NoteAddButton from "./NoteAddButton"
import NoteFolderScrollerButton from "./NoteFolderScrollerButton"
import NoteShowButton from "./NoteShowButton"
import StringUtils from "../../../../utils/string/StringUtils"
import SettingValueService from "../../../../db/services/settings/SettingValueService"
import { noteEmojiesSetting } from "../../../../resources/settings/user"
import NoteFolderDeleteButton from "./NoteFolderDeleteButton"
import NoteFolderChangePublicButton from "./NoteFolderChangePublicButton"

type T = Note

class NoteScrollerButton extends ScrollerButton<T, NoteScrollerButtonData> {
    override schema: GenMessage<NoteScrollerButtonData> = NoteScrollerButtonDataSchema
    override minimumRank: number = RankUtils.min
    override settingId: number = 149
    override name: string = 'nscr'

    protected override _isNeedCache: boolean = true
    protected override _objectsPerPage: number = 7
    protected override _stopIfNoObjects: boolean = false

    protected override async _getControlsButtonData(options: ScrollerButtonEditMessageOptions<Note, NoteScrollerButtonData>): Promise<Omit<NoteScrollerButtonData, "data" | "$typeName" | "$unknown">> {
        const {
            data
        } = options

        const {
            folderId,
            owner
        } = data

        return {
            folderId,
            owner
        }
    }

    protected override async _getRawObjects(options: CallbackQueryActionOptions<NoteScrollerButtonData>): Promise<T[]> {
        const {
            data
        } = options

        const {
            folderId,
        } = data

        return (await NoteService.getAllByFolder(folderId))
            .sort((a, b) => a.text.localeCompare(b.text))
    }

    protected override async _getKeyboard(options: ScrollerButtonEditMessageOptions<T, NoteScrollerButtonData>): Promise<InlineKeyboard> {
        const keyboard = new InlineKeyboard()
        const {
            slicedObjects: notes,
            ctx,
            id,
            page,
            data
        } = options
        const bigId = BigInt(id)
        const {
            owner,
            folderId
        } = data
        const isOwner = bigId == owner

        const emojies = await SettingValueService.getValue({
            id,
            setting: noteEmojiesSetting
        })

        let i = 0
        for (const note of notes) {
            keyboard
                .add(
                    NoteShowButton.button({
                        ctx,
                        data: {
                            id: bigId,
                            noteId: note.id,
                            page
                        },
                        vars: {
                            text: StringUtils.stripTags(note.text),
                            emojies,
                            index: this._getStartIndex(page) + i++
                        }
                    })
                )
                .row()
        }

        if (isOwner) {
            keyboard
                .add(
                    NoteAddButton.button({
                        ctx,
                        data: {
                            folderId,
                            id: bigId
                        },
                        style: 'success'
                    })
                )
                .add(NoteFolderDeleteButton.button({
                    ctx,
                    data: {
                        folderId,
                        id: bigId
                    },
                    style: 'danger'
                }))
                .row()
        }

        keyboard.add(
            NoteFolderScrollerButton.button({
                ctx,
                data: {
                    owner,
                    data: {
                        $typeName: 'ScrollerData',
                        id: bigId,
                        data: {
                            case: 'update',
                            value: false
                        }
                    },
                },
                style: 'primary',
                key: 'button/back'
            })
        )

        if (isOwner) {
            keyboard.add(
                NoteFolderChangePublicButton.button({
                    ctx,
                    data: {
                        id: bigId,
                        folderId
                    },
                    style: 'primary'
                })
            )
        }

        return keyboard
    }

    protected override async _editMessage(options: ScrollerButtonEditMessageOptions<T, NoteScrollerButtonData>): Promise<ScrollerButtonEditMessageResult> {
        const {
            data,
            chatId
        } = options

        const {
            folderId,
            owner: rawOwnerId
        } = data

        const ownerId = Number(rawOwnerId)
        const owner = await UserService.get(chatId, ownerId)

        const folder = await NoteFolderService.get(folderId)
        if (!folder) {
            return {
                key: 'notes/message/not-exist',
                vars: {
                    owner
                }
            }
        }

        return {
            key: 'notes/message/start',
            vars: {
                owner,
                folder
            }
        }
    }
}

export default new NoteScrollerButton()