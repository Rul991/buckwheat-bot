import { PARSE_MODE } from '../../utils/consts'
import FileUtils from '../../utils/FileUtils'
import Logging from '../../utils/Logging'
import { CallbackButtonContext } from '../../utils/types'
import RulesService from '../db/services/chat/RulesService'
import InlineKeyboardManager from '../main/InlineKeyboardManager'
import CallbackButtonAction from './CallbackButtonAction'

export default class RuleChangeAction extends CallbackButtonAction {
    constructor() {
        super()
        this._name = 'rulechange'
    }

    async execute(ctx: CallbackButtonContext, data: string): Promise<void> {
        const [prevPage, addedValue] = data
            .split('_')
            .map(val => +val)
        const rules = await RulesService.get()
        
        const newPage = prevPage + addedValue
        let currentPage = newPage

        if(currentPage < 0) {
            currentPage = Math.max(0, rules.length - 1)
        }
        else if(currentPage >= rules.length) {
            currentPage = 0
        }

        if(prevPage == currentPage) return

        try {
            await ctx.editMessageText(
                await FileUtils.readTextFromResource(
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
                        inline_keyboard: await InlineKeyboardManager.get('rules', `${currentPage}`)
                    },
                    parse_mode: PARSE_MODE
                }
            )
        }
        catch(e) {
            Logging.error(e)
        }
    }
}