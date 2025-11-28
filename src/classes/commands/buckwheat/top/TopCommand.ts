import MessageUtils from '../../../../utils/MessageUtils'
import { TextContext, MaybeString } from '../../../../utils/values/types/types'
import BuckwheatCommand from '../../base/BuckwheatCommand'
import InlineKeyboardManager from '../../../main/InlineKeyboardManager'
import TopUtils from '../../../../utils/TopUtils'

export default class TopCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'топ'
        this._description = 'показываю топ игроков по разным параметрам'
    }

    async execute(ctx: TextContext, _: MaybeString): Promise<void> {
        await MessageUtils.answerMessageFromResource(
            ctx,
            `text/commands/top/start.pug`,
            {
                inlineKeyboard: await InlineKeyboardManager.map(
                    'top/start',
                    {
                        values: {
                            top: TopUtils.getTitleAndKeys()
                                .map(({key, title}) => {
                                    return {
                                        text: title,
                                        data: key
                                    }
                                })
                        }
                    }
                )
            }
        )
    }
}