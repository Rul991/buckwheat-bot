import CommandDescriptionUtils from '../../../utils/CommandDescriptionUtils'
import MessageUtils from '../../../utils/MessageUtils'
import { TextContext, CommandStrings, MaybeString } from '../../../utils/values/types'
import PremiumChatService from '../../db/services/chat/PremiumChatService'
import LinkedChatService from '../../db/services/linkedChat/LinkedChatService'
import ConditionalCommand from '../base/ConditionalCommand'

export default class extends ConditionalCommand {
    async condition(ctx: TextContext, [_, command]: CommandStrings): Promise<boolean> {
        const chatId = await LinkedChatService.getCurrent(ctx, ctx.from.id)
        if(!chatId) return false

        const [choosedCommand] = CommandDescriptionUtils
            .getAll()
            .filter(
                v => [v.name, ...v.aliases]
                    .some(name => command == name)
            )
        if(!choosedCommand) return false

        return choosedCommand.isPremium && !(await PremiumChatService.isPremium(chatId))
    }

    async execute(ctx: TextContext, _: MaybeString): Promise<void> {
        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/other/no-premium.pug'
        )
    }
}