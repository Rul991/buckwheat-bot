import { Telegraf } from 'telegraf'
import PhotoAction from '../../actions/photo/PhotoAction'
import BaseHandler from './BaseHandler'
import CommandUtils from '../../../utils/CommandUtils'

export default class PhotoHandler extends BaseHandler<PhotoAction, Record<string, PhotoAction>> {
    constructor() {
        super({})
    }

    setup(bot: Telegraf): void {
        bot.on('photo', async ctx => {
            const [firstWord, command, other] = CommandUtils.getCommandStrings(ctx.message.caption ?? '')

            if(CommandUtils.isCommand(firstWord) && command) {
                const instance = this._instances[command]
                if(!instance) return

                await instance.execute(ctx, other)
            }
        })
    }

}