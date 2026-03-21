import MessageUtils from '../../../../utils/MessageUtils'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'
import ChatService from '../../../db/services/chat/ChatService'
import InlineKeyboardManager from '../../../main/InlineKeyboardManager'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default class ChatsCommand extends BuckwheatCommand {
    protected _settingId: string = 'chats'

    constructor () {
        super()
        this._name = 'чаты'
        this._description = 'показываю публичные чаты, в которых есть я'
    }

    async execute(options: BuckwheatCommandOptions): Promise<void> {
        const {
            ctx,
            id
        } = options

        const count = await ChatService.count()

        await MessageUtils.answerMessageFromResource(
            ctx,
            'commands/chats/chats',
            {
                inlineKeyboard: await InlineKeyboardManager.get(
                    'chats/start',
                    {
                        globals: {
                            id
                        }
                    }
                ),
                changeValues: {
                    count
                }
            }
        )
    }
}