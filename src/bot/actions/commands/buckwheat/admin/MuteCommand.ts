import type { AdminExecuteOptions } from "../../../../../types/options"
import AdminUtils from "../../../../../utils/bot/AdminUtils"
import AdminCommand from "./AdminCommand"

export default class MuteCommand extends AdminCommand {
    override aliases: string[] = ['замутить', 'замьютить']
    override name: string = 'мут'
    override filename: string = 'mute'
    override settingId: number = 4
    
    protected override async _execute(options: AdminExecuteOptions): Promise<boolean> {
        const {
            ctx,
            id,
            ms
        } = options

        return await AdminUtils.mute(ctx, id, ms)
    }
}