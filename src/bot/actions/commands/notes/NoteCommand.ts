import UserService from "../../../../db/services/user/UserService"
import type { BuckwheatCommandOptions } from "../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import { startNotesKeyboard } from "../../../keyboards/notes"
import BuckwheatCommand from "../../base/BuckwheatCommand"

export default class NoteCommand extends BuckwheatCommand {
    override aliases: string[] = ['заметка']
    override filename: string = 'notes'
    override minimumRank: number = RankUtils.min
    override settingId: number = 147
    override name: string = 'заметки'
    override isSupportReply: boolean = true

    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            ctx,
            isSelf,
            replyOrUserFrom,
            chatId,
            id
        } = options

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