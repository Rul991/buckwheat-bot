import FileUtils from '../../../../utils/FileUtils'
import { FIRST_INDEX } from '../../../../utils/values/consts'
import { ScrollerEditMessage, ScrollerGetObjectsOptions, ScrollerSendMessageOptions } from '../../../../utils/values/types/types'
import { CallbackButtonContext } from '../../../../utils/values/types/contexts'
import RulesService from '../../../db/services/chat/RulesService'
import LinkedChatService from '../../../db/services/linkedChat/LinkedChatService'
import InlineKeyboardManager from '../../../main/InlineKeyboardManager'
import ScrollerAction from './ScrollerAction'

export default class RuleChangeAction extends ScrollerAction<string> {
    constructor() {
        super()
        this._name = 'rulechange'
        this._objectsPerPage = 1
    }

    protected async _getObjects(ctx: CallbackButtonContext, { chatId }: ScrollerGetObjectsOptions<string>): Promise<string[]> {
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
                        text: objects[FIRST_INDEX]
                    }
                }
            ),

            options: {
                reply_markup: {
                    inline_keyboard: await InlineKeyboardManager.get('rules', `${currentPage}`)
                },
            }
        }
    }
}