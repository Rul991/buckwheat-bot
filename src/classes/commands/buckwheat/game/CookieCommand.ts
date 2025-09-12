import { BAD_COOKIE_CHANCE, COOKIE_WORK_TIME } from '../../../../utils/values/consts'
import ContextUtils from '../../../../utils/ContextUtils'
import MessageUtils from '../../../../utils/MessageUtils'
import { TextContext, MaybeString } from '../../../../utils/values/types'
import InventoryItemService from '../../../db/services/items/InventoryItemService'
import WorkTimeService from '../../../db/services/work/WorkTimeService'
import BuckwheatCommand from '../../base/BuckwheatCommand'
import RandomUtils from '../../../../utils/RandomUtils'
import LinkedChatService from '../../../db/services/linkedChat/LinkedChatService'

export default class CookieCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'печенька'
        this._description = 'вы можете съесть или поделиться печенькой'
        this._replySupport = true
        this._aliases = [
            'печенье'
        ]
    }

    async execute(ctx: TextContext, _: MaybeString): Promise<void> {
        const chatId = await LinkedChatService.getChatId(ctx)
        if(!chatId) return
        
        const reply = ctx.message.reply_to_message
        const userId = ctx.from.id

        const [hasCookie] = await InventoryItemService.use(
            chatId,
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
                chatId,
                reply.from.id, 
                'cookie'
            )

            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/cookie/share.pug',
                {
                    changeValues: await ContextUtils.getUser(chatId, reply.from.id)
                }
            )
        }
        else if(RandomUtils.chance(BAD_COOKIE_CHANCE)) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/cookie/bad.pug'
            )
        }
        else {
            await WorkTimeService.add(chatId, userId, COOKIE_WORK_TIME)
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/cookie/eat.pug'
            )
        }
    }
}