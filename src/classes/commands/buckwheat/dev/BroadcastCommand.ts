import MessageUtils from '../../../../utils/MessageUtils'
import RankUtils from '../../../../utils/RankUtils'
import TimeUtils from '../../../../utils/TimeUtils'
import { BROADCAST_TIME, DEV_ID, MODE } from '../../../../utils/values/consts'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'
import ChatService from '../../../db/services/chat/ChatService'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default class extends BuckwheatCommand {
    protected _settingId: string = 'broadcast'
    protected _canBeChanged: boolean = false

    constructor() {
        super()
        this._name = 'броадкаст'
        this._minimumRank = RankUtils.max + 1
        this._needData = true
        this._isShow = false
    }

    async execute({ ctx, other, id }: BuckwheatCommandOptions): Promise<void> {
        if(id != DEV_ID) {
            await MessageUtils.sendWrongCommandMessage(ctx)
            return
        }

        if(!other) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/broadcast/no-other.pug'
            )
            return
        }

        const chats = await ChatService.getAll()

        for (const { id } of chats) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/broadcast/broadcast.pug',
                {
                    changeValues: {
                        other
                    },
                    chatId: id,
                    isReply: false
                }
            )
            await TimeUtils.sleep(BROADCAST_TIME)

            if(MODE == 'dev') {
                break
            }
        }
    }
}