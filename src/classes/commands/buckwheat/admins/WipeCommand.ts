import MessageUtils from '../../../../utils/MessageUtils'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'
import LegacyInlineKeyboardManager from '../../../main/LegacyInlineKeyboardManager'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default class WipeCommand extends BuckwheatCommand {
    protected _settingId: string = 'wipe'

    constructor() {
        super()
        this._name = 'вайп'
        this._isShow = false
        this._minimumRank = 5
    }

    async execute({ ctx, chatId, id }: BuckwheatCommandOptions): Promise<void> {
        if(ctx.chat.type == 'private') {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/wipe/private.pug'
            )
            return
        }
        
        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/wipe/choose.pug',
            {
                inlineKeyboard: await LegacyInlineKeyboardManager.get(
                    'wipe/wipe', 
                    {
                        chatId: JSON.stringify({chatId}),
                        userId: JSON.stringify({userId: id})
                    }
                )
            }
        )
    }
}