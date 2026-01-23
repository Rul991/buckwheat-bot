import { BAD_COOKIE_CHANCE, COOKIE_WORK_TIME } from '../../../../utils/values/consts'
import ContextUtils from '../../../../utils/ContextUtils'
import MessageUtils from '../../../../utils/MessageUtils'
import InventoryItemService from '../../../db/services/items/InventoryItemService'
import WorkTimeService from '../../../db/services/work/WorkTimeService'
import BuckwheatCommand from '../../base/BuckwheatCommand'
import RandomUtils from '../../../../utils/RandomUtils'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'
import GrindSettingService from '../../../db/services/settings/GrindSettingService'

export default class CookieCommand extends BuckwheatCommand {
    protected _settingId: string = 'cookie'

    constructor () {
        super()
        this._name = 'печенька'
        this._description = 'вы можете съесть или поделиться печенькой'
        this._replySupport = true
        this._aliases = [
            'печенье'
        ]
    }

    async execute({ ctx, chatId, id: userId, replyFrom }: BuckwheatCommandOptions): Promise<void> {
        const [hasCookie] = await InventoryItemService.use(
            chatId,
            userId,
            'cookie'
        )

        if (!hasCookie) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/cookie/no.pug'
            )
            return
        }

        if (replyFrom) {
            const replyId = replyFrom.id
            await InventoryItemService.add(
                chatId,
                replyId,
                'cookie'
            )

            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/cookie/share.pug',
                {
                    changeValues: await ContextUtils.getUser(chatId, replyId)
                }
            )
        }
        else if (RandomUtils.chance(BAD_COOKIE_CHANCE)) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/cookie/bad.pug'
            )
        }
        else {
            await WorkTimeService.add(chatId, userId, COOKIE_WORK_TIME)
            
            const isSendMessage = await GrindSettingService.isSendMessage(ctx, userId)
            if(!isSendMessage) return

            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/cookie/eat.pug'
            )
        }
    }
}