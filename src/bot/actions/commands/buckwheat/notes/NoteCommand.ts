import { MAX_NOTE_TEXT_LENGTH } from "../../../../../consts/lengths"
import Note from "../../../../../db/entities/notes/Note"
import NoteFolderService from "../../../../../db/services/notes/NoteFolderService"
import NoteService from "../../../../../db/services/notes/NoteService"
import UserService from "../../../../../db/services/user/UserService"
import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import MessageEntityUtils from "../../../../../utils/bot/MessageEntityUtils"
import RankUtils from "../../../../../utils/db/RankUtils"
import { startNotesKeyboard } from "../../../../keyboards/notes"
import BuckwheatCommand from "../../../base/BuckwheatCommand"

export default class NoteCommand extends BuckwheatCommand {
    override aliases: string[] = ['заметка']
    override filename: string = 'notes'
    override minimumRank: number = RankUtils.min
    override settingId: number = 147
    override name: string = 'заметки'
    override isSupportReply: boolean = true
    override needData: boolean = true

    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            ctx,
            isSelf,
            replyOrUserFrom,
            chatId,
            id,
            other
        } = options

        if(other) {
            const folder = await NoteFolderService.getFirst(id)
            if(!folder) {
                return {
                    key: 'notes-folder/message/dont-have'
                }
            }
            
            const user = await ctx.vars.user.get()
            const msg = ctx.msg
            const text = MessageEntityUtils.messageToHtml({
                ...msg,
                text: msg.text.slice(0, MAX_NOTE_TEXT_LENGTH)
            })
            const folderTitle = folder.title

            await NoteService.create(
                new Note({
                    text,
                    folderId: folder.id
                })
            )

            return {
                key: 'notes/conversation/added',
                options: {
                    vars: {
                        vars: {
                            user
                        },
                        folderTitle
                    }
                }
            }
        }

        const replyId = replyOrUserFrom.id
        const owner = isSelf ?
            await ctx.vars.user.get() :
            await UserService.get(chatId, replyId)

        return {
            key: 'notes-folder/message/start',
            options: {
                vars: {
                    owner,
                },
                keyboard: await startNotesKeyboard(
                    ctx,
                    {
                        id,
                        owner: replyId
                    }
                )
            }
        }
    }
}