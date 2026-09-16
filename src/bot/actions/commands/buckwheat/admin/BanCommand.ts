import type { AdminExecuteOptions } from "../../../../../types/options"
import AdminUtils from "../../../../../utils/bot/AdminUtils"
import AdminCommand from "./AdminCommand"

export default class BanCommand extends AdminCommand {
    override aliases: string[] = ['забанить']
    override name: string = 'бан'
    override filename: string = 'ban'
    override settingId: number = 1
    
    protected override async _execute(options: AdminExecuteOptions): Promise<boolean> {
        const {
            ctx,
            id,
            ms
        } = options

        return await AdminUtils.ban(ctx, id, ms)
    }
}