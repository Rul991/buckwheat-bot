import FileUtils from '../../../utils/FileUtils'
import { CallbackButtonContext, ScrollerEditMessage, ScrollerSendMessageOptions } from '../../../utils/values/types'
import RulesService from '../../db/services/chat/RulesService'
import LinkedChatService from '../../db/services/linkedChat/LinkedChatService'
import CallbackButtonManager from '../../main/CallbackButtonManager'
import ScrollerAction from './ScrollerAction'

export default class RuleChangeAction extends ScrollerAction<string> {
    constructor() {
        super()
        this._name = 'rulechange'
    }

    protected async _getObjects(ctx: CallbackButtonContext): Promise<string[]> {
        const chatId = await LinkedChatService.getChatId(ctx)
        if(!chatId) return []

        return await RulesService.get(chatId)
    }

    protected async _editMessage(
        _: CallbackButtonContext, 
        {
            currentPage, 
            length, 
            objects
        }: ScrollerSendMessageOptions<string>
    ): Promise<ScrollerEditMessage> {
        return {
            text: await FileUtils.readPugFromResource(
                'text/commands/rules/rule.pug',
                {
                    changeValues: {
                        number: currentPage,
                        rulesCount: length,
                        text: objects[currentPage]
                    }
                }
            ),

            options: {
                reply_markup: {
                    inline_keyboard: await CallbackButtonManager.get('rules', `${currentPage}`)
                },
            }
        }
    }
}