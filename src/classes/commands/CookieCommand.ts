import { COOKIE_WORK_TIME } from '../../utils/consts'
import MessageUtils from '../../utils/MessageUtils'
import { TextContext, MaybeString } from '../../utils/types'
import InventoryItemService from '../db/services/items/InventoryItemService'
import WorkTimeService from '../db/services/work/WorkTimeService'
import BuckwheatCommand from './base/BuckwheatCommand'

export default class CookieCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'печенька'
        this._description = 'вы можете съесть или поделиться печенькой'
        this._replySupport = true
    }

    async execute(ctx: TextContext, _: MaybeString): Promise<void> {
        const reply = ctx.message.reply_to_message
        const userId = ctx.from.id

        const hasCookie = await InventoryItemService.use(
            userId, 
            'cookie'
        )

        if(!hasCookie) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/cookie/no.pug'
            )
            return
        }

        if(reply?.from) {
            await InventoryItemService.add(
                reply.from.id, 
                'cookie'
            )

            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/cookie/share.pug'
            )
        }
        else {
            await WorkTimeService.add(userId, COOKIE_WORK_TIME)
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/cookie/eat.pug'
            )
        }
    }
}