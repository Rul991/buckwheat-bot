import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import type NoteFolder from "../../../../db/entities/notes/NoteFolder"
import { InlineKeyboard } from "grammy"
import { type NoteFolderScrollerButtonData, NoteFolderScrollerButtonDataSchema } from "../../../../protos/notes_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { ScrollerButtonEditMessageOptions } from "../../../../types/options"
import type { ScrollerButtonEditMessageResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import ScrollerButton from "../scroller/ScrollerButton"
import NoteFolderService from "../../../../db/services/notes/NoteFolderService"
import UserService from "../../../../db/services/user/UserService"
import NoteScrollerButton from "./NoteScrollerButton"
import NoteFolderAddButton from "./NoteFolderAddButton"

type T = NoteFolder

class NoteFolderScrollerButton extends ScrollerButton<T, NoteFolderScrollerButtonData> {
    override schema: GenMessage<NoteFolderScrollerButtonData> = NoteFolderScrollerButtonDataSchema
    override minimumRank: number = RankUtils.min
    override settingId: number = 148
    override name: string = 'nfscr'

    protected override _isNeedCache: boolean = true
    protected override _objectsPerPage: number = 5

    protected override async _getControlsButtonData(options: ScrollerButtonEditMessageOptions<NoteFolder, NoteFolderScrollerButtonData>): Promise<Omit<NoteFolderScrollerButtonData, "data" | "$typeName" | "$unknown">> {
        const {
            data
        } = options

        const {
            owner
        } = data

        return {
            owner
        }
    }

    protected override async _getRawObjects(options: CallbackQueryActionOptions<NoteFolderScrollerButtonData>): Promise<T[]> {
        const {
            data,
            id
        } = options

        const {
            owner: rawOwner,
        } = data
        const owner = Number(rawOwner)

        return (await NoteFolderService.getAllByOwner(owner, owner != id))
            .sort((a, b) => a.title.localeCompare(b.title))
    }

    protected override async _getKeyboard(options: ScrollerButtonEditMessageOptions<T, NoteFolderScrollerButtonData>): Promise<InlineKeyboard> {
        const keyboard = new InlineKeyboard()
        const {
            slicedObjects: folders,
            ctx,
            id,
            data
        } = options
        const bigId = BigInt(id)
        const {
            owner
        } = data

        for (const folder of folders) {
            keyboard.add(
                NoteScrollerButton.button({
                    ctx,
                    data: {
                        folderId: folder.id,
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
                    key: 'notes-folder/button/show',
                    vars: {
                        folder
                    }
                })
            )
        }

        if (owner == bigId) {
            keyboard.add(
                NoteFolderAddButton.button({
                    ctx,
                    data: {
                        id: bigId
                    },
                    style: 'success',
                })
            )
        }

        return keyboard.toFlowed(1)
    }

    protected override async _editMessage(options: ScrollerButtonEditMessageOptions<T, NoteFolderScrollerButtonData>): Promise<ScrollerButtonEditMessageResult> {
        const {
            ctx,
            data,
            id,
            chatId
        } = options

        const {
            owner: rawOwner,
        } = data
        const ownerId = Number(rawOwner)
        const owner = id == ownerId ?
            await ctx.vars.user.get() :
            await UserService.get(chatId, ownerId)

        return {
            key: 'notes-folder/message/start',
            vars: {
                owner,
            }
        }
    }
}

export default new NoteFolderScrollerButton()