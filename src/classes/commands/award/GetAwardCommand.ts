import ContextUtils from '../../../utils/ContextUtils'
import MessageUtils from '../../../utils/MessageUtils'
import { BuckwheatCommandOptions } from '../../../utils/values/types/action-options'
import InlineKeyboardManager from '../../main/InlineKeyboardManager'
import BuckwheatCommand from '../base/BuckwheatCommand'

export default class GetAwardCommand extends BuckwheatCommand {
    protected _settingId: string = 'getAward'

    constructor () {
        super()
        this._name = 'награды'
        this._aliases = [
            'медали',
            'заслуги'
        ]
        this._description = 'показываю все твои награды'
    }

    private _getId(options: BuckwheatCommandOptions): number {
        const { replyOrUserFrom } = options
        return replyOrUserFrom.id
    }

    async execute(options: BuckwheatCommandOptions): Promise<void> {
        const { ctx, chatId } = options

        const ownerId = this._getId(options)
        const user = await ContextUtils.getUser(chatId, ownerId)

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/award/start-get.pug',
            {
                changeValues: { user },
                inlineKeyboard: await InlineKeyboardManager.get(
                    'awards/start', 
                    {
                        globals: {
                            owner: ownerId
                        }
                    }
                )
            }
        )
    }
}