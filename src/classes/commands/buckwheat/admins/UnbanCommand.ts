import { Context } from 'telegraf'
import AdminCommand from './AdminCommand'
import AdminUtils from '../../../../utils/AdminUtils'
import { TextContext } from '../../../../utils/values/types/contexts'

export default class UnbanCommand extends AdminCommand {
    protected _settingId: string = 'unban'

    constructor() {
        super()

        this._name = 'разбан'
        this._description = 'разрешаю игроку войти в чат'
        this._replySupport = true

        this._folder = 'ban'
    }

    protected async _do(ctx: TextContext, replyId: number, _: number): Promise<boolean> {
        return await AdminUtils.unban(ctx, replyId)
    }
}