import ContextUtils from '../../../../utils/ContextUtils'
import MessageUtils from '../../../../utils/MessageUtils'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default class extends BuckwheatCommand {
    protected _settingId: string = 'say'

    constructor() {
        super()
        this._name = 'скажи'
        this._description = 'повторяю то, что скажите вы'
        this._needData = true
        this._argumentText = 'ваши слова'
    }

    async execute(options: BuckwheatCommandOptions): Promise<void> {
        const {
            ctx,
            other,
            chatId,
            id
        } = options

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/say/done.pug',
            {
                changeValues: {
                    other: other,
                    user: await ContextUtils.getUser(chatId, id)
                }
            }
        )
    }
}