import type { AdminExecuteOptions } from "../../../../../types/options"
import AdminUtils from "../../../../../utils/bot/AdminUtils"
import AdminCommand from "./AdminCommand"

export default class UnMuteCommand extends AdminCommand {
    protected override _showTime: boolean = false
    override aliases: string[] = ['анмут']
    override name: string = 'размут'
    override filename: string = 'unmute'
    override settingId: number = 6
    
    protected override async _execute(options: AdminExecuteOptions): Promise<boolean> {
        const {
            ctx,
            id,
        } = options

        return await AdminUtils.unmute(ctx, id)
    }
}