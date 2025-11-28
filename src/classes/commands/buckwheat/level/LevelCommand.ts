import MessageUtils from '../../../../utils/MessageUtils'
import { TextContext, MaybeString } from '../../../../utils/values/types/types'
import LevelService from '../../../db/services/level/LevelService'
import LinkedChatService from '../../../db/services/linkedChat/LinkedChatService'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default class LevelCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'уровень'
        this._description = 'показываю твой уровень'
        this._aliases = [
            'левел',
            'лвл',
        ]
    }

    async execute(ctx: TextContext, _: MaybeString): Promise<void> {
        const chatId = await LinkedChatService.getCurrent(ctx)
        if(!chatId) return

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/level/level.pug',
            {
                changeValues: {
                    level: await LevelService.get(chatId, ctx.from.id)
                }
            }
        )
    }
}