import type { AdminExecuteOptions } from "../../../../../types/options"
import AdminUtils from "../../../../../utils/bot/AdminUtils"
import AdminCommand from "./AdminCommand"

export default class UnBanCommand extends AdminCommand {
    protected override _showTime: boolean = false
    override aliases: string[] = ['анбан']
    override name: string = 'разбан'
    override filename: string = 'unban'
    override settingId: number = 5
    
    protected override async _execute(options: AdminExecuteOptions): Promise<boolean> {
        const {
            ctx,
            id,
        } = options

        return await AdminUtils.unban(ctx, id)
    }
}