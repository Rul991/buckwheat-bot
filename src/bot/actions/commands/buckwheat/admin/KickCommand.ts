import type { AdminExecuteOptions } from "../../../../../types/options"
import AdminUtils from "../../../../../utils/bot/AdminUtils"
import AdminCommand from "./AdminCommand"

export default class KickCommand extends AdminCommand {
    protected override _showTime: boolean = false
    override aliases: string[] = ['выгнать', 'изгнать']
    override name: string = 'кик'
    override filename: string = 'kick'
    override settingId: number = 3
    
    protected override async _execute(options: AdminExecuteOptions): Promise<boolean> {
        const {
            ctx,
            id
        } = options

        return await AdminUtils.kick(ctx, id)
    }
}