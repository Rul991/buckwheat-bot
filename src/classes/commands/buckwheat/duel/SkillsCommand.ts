import MessageUtils from '../../../../utils/MessageUtils'
import { TextContext, MaybeString } from '../../../../utils/values/types/types'
import LinkedChatService from '../../../db/services/linkedChat/LinkedChatService'
import UserClassService from '../../../db/services/user/UserClassService'
import InlineKeyboardManager from '../../../main/InlineKeyboardManager'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default class SkillsCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'навыки'
        this._aliases = [
            'навык',
            'скиллы',
            'спеллы'
        ]
        this._description = 'позволяю работать с навыками'
    }

    async execute(ctx: TextContext, _: MaybeString): Promise<void> {
        const id = ctx.from.id
        const chatId = await LinkedChatService.getCurrent(ctx, id)
        if(!chatId) return

        if(!await UserClassService.isPlayer(chatId, id)) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/skills/not-player.pug'
            )
            return
        }

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/skills/menu.pug',
            {
                inlineKeyboard: await InlineKeyboardManager.get(
                    'skills/menu', 
                    JSON.stringify({id})
                )
            }
        )
    }
}