import MessageUtils from '../../../../utils/MessageUtils'
import { TextContext, MaybeString } from '../../../../utils/values/types'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default class ChannelCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'тгк'
        this._description = 'даю ссылку на мой телеграм-канал',
        this._aliases = [
            'помощь',
            'канал'
        ]
    }

    async execute(ctx: TextContext, _: MaybeString): Promise<void> {
        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/channel/channel.pug'
        )
    }
}