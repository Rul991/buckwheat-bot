import { MAX_NAME_LENGTH } from "../../../../../consts/lengths"
import { UNKNOWN_NAME } from "../../../../../consts/texts"
import UserNameService from "../../../../../db/services/user/UserNameService"
import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import RankUtils from "../../../../../utils/db/RankUtils"
import SetProfilePropertyCommand from "./SetProfilePropertyCommand"

export default class SetNameCommand extends SetProfilePropertyCommand {
    protected override _length: number = MAX_NAME_LENGTH
    override aliases: string[] = ['ник']
    override minimumRank: number = RankUtils.min
    override settingId: number = 20
    override name: string = 'имя'
    override filename: string = 'name'

    protected override async _getProperty(options: BuckwheatCommandOptions): Promise<string> {
        const {
            ctx,
            chatId,
            replyOrUserFrom
        } = options

        if(replyOrUserFrom.id == ctx.vars.user?.id) {
            return ctx.vars.user.name
        }
        else {
            return await UserNameService.get(chatId, replyOrUserFrom.id) ?? UNKNOWN_NAME
        }
    }
    protected override async _execute(options: BuckwheatCommandOptions & { text: string }): Promise<string> {
        const {
            text,
            chatId,
            replyOrUserFrom,
        } = options

        const user = await UserNameService.set(chatId, replyOrUserFrom.id, text)
        return user?.name ?? UNKNOWN_NAME
    }
}