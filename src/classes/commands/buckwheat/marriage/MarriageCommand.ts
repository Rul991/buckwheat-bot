import ContextUtils from '../../../../utils/ContextUtils'
import MessageUtils from '../../../../utils/MessageUtils'
import TimeUtils from '../../../../utils/TimeUtils'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'
import { MaybeString } from '../../../../utils/values/types/types'
import { TextContext } from '../../../../utils/values/types/contexts'
import LinkedChatService from '../../../db/services/linkedChat/LinkedChatService'
import MarriageService from '../../../db/services/marriage/MarriageService'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default class MarriageCommand extends BuckwheatCommand {
    constructor () {
        super()
        this._name = 'брак'
        this._aliases = [
            'семья',
            'отношения'
        ]
        this._replySupport = true
        this._description = 'показываю семейное положение игрока'
    }

    private _getId({ replyOrUserFrom }: BuckwheatCommandOptions) {
        return replyOrUserFrom.id
    }

    async execute(options: BuckwheatCommandOptions): Promise<void> {
        const { ctx, chatId } = options
        const id = this._getId(options)
        const marriage = await MarriageService.get(chatId, id)

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/marriage/info.pug',
            {
                changeValues: {
                    isMarried: Boolean(marriage.partnerId),
                    partner: await ContextUtils.getUser(chatId, marriage.partnerId),
                    user: await ContextUtils.getUser(chatId, id),
                    time: TimeUtils.formatMillisecondsToTime(Date.now() - (marriage.startedAt ?? 0))
                }
            }
        )
    }
}