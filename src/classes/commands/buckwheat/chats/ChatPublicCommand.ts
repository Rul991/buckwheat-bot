import MessageUtils from '../../../../utils/MessageUtils'
import RankUtils from '../../../../utils/RankUtils'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'
import ChatService from '../../../db/services/chat/ChatService'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default class extends BuckwheatCommand {
    protected _settingId: string = 'chats-public'

    constructor() {
        super()
        this._name = 'публичность'
        this._description = 'меняю публичность чата на противоположную'
        this._minimumRank = RankUtils.max
    }

    async execute(options: BuckwheatCommandOptions): Promise<void> {
        const {
            chatId,
            ctx
        } = options

        const newPublic = await ChatService.togglePublic(chatId)

        await MessageUtils.answerMessageFromResource(
            ctx,
            'commands/chats/toggle-public',
            {
                changeValues: {
                    isPublic: newPublic
                }
            }
        )
    }
}