import { MAX_DESCRIPTION_LENGTH } from "../../../../../consts/lengths"
import { UNKNOWN_DESCRIPTION } from "../../../../../consts/texts"
import UserDescriptionService from "../../../../../db/services/user/UserDescriptionService"
import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import RankUtils from "../../../../../utils/db/RankUtils"
import SetProfilePropertyCommand from "./SetProfilePropertyCommand"

export default class SetDescriptionCommand extends SetProfilePropertyCommand {
    protected override _length: number = MAX_DESCRIPTION_LENGTH
    protected override _isHtml: boolean = true
    
    override aliases: string[] = ['опиши']
    override minimumRank: number = RankUtils.min
    override settingId: number = 21
    override name: string = 'описание'
    override filename: string = 'description'

    protected override async _getProperty(options: BuckwheatCommandOptions): Promise<string> {
        const {
            ctx,
            chatId,
            replyOrUserFrom
        } = options

        if(replyOrUserFrom.id == ctx.vars.user?.id) {
            return ctx.vars.user.description
        }
        else {
            return await UserDescriptionService.get(chatId, replyOrUserFrom.id) ?? UNKNOWN_DESCRIPTION
        }
    }
    protected override async _execute(options: BuckwheatCommandOptions & { text: string }): Promise<string> {
        const {
            text: result,
            chatId,
            replyOrUserFrom,
        } = options

        await UserDescriptionService.set(chatId, replyOrUserFrom.id, result)
        return result
    }
}