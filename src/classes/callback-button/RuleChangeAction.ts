import FileUtils from '../../utils/FileUtils'
import Logging from '../../utils/Logging'
import MessageUtils from '../../utils/MessageUtils'
import Pager from '../../utils/Pager'
import { CallbackButtonContext } from '../../utils/values/types'
import RulesService from '../db/services/chat/RulesService'
import LinkedChatService from '../db/services/linkedChat/LinkedChatService'
import CallbackButtonManager from '../main/CallbackButtonManager'
import CallbackButtonAction from './CallbackButtonAction'

export default class RuleChangeAction extends CallbackButtonAction {
    constructor() {
        super()
        this._name = 'rulechange'
    }

    async execute(ctx: CallbackButtonContext, data: string): Promise<string | void> {
        const chatId = await LinkedChatService.getChatId(ctx)
        if(!chatId) return 'Что-то пошло не так!'

        const rules = await RulesService.get(chatId)
        const currentPage = Pager.wrapPages(data, rules.length)

        if(currentPage === -1) return

        try {
            await MessageUtils.editText(
                ctx,
                await FileUtils.readPugFromResource(
                    'text/commands/rules/rule.pug',
                    {
                        changeValues: {
                            number: currentPage,
                            rulesCount: rules.length,
                            text: rules[currentPage]
                        }
                    }
                ),
                {
                    reply_markup: {
                        inline_keyboard: await CallbackButtonManager.get('rules', `${currentPage}`)
                    },
                }
            )
        }
        catch(e) {
            Logging.error(e)
        }
    }
}