import { Telegraf } from 'telegraf'
import PhotoAction from '../../actions/photo/PhotoAction'
import BaseHandler from './BaseHandler'
import CommandUtils from '../../../utils/CommandUtils'
import { MyTelegraf } from '../../../utils/values/types/types'

export default class PhotoHandler extends BaseHandler<PhotoAction, Record<string, PhotoAction>, typeof PhotoAction> {
    constructor() {
        super({}, PhotoAction)
    }

    setup(bot: MyTelegraf): void {
        bot.on('photo', async ctx => {
            await CommandUtils.doIfCommand(
                ctx.message.caption ?? '',
                async ([_, command, other]) => {
                    if(!command) return

                    const instance = this._container[command]
                    if(!instance) return

                    await instance.execute(ctx, other)
                }
            )
        })
    }

}