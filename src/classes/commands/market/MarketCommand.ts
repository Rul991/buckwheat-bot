import MessageUtils from '../../../utils/MessageUtils'
import { BuckwheatCommandOptions } from '../../../utils/values/types/action-options'
import LegacyInlineKeyboardManager from '../../main/LegacyInlineKeyboardManager'
import BuckwheatCommand from '../base/BuckwheatCommand'

export default class extends BuckwheatCommand {
    protected _settingId: string = 'bazaar'
    constructor() {
        super()
        this._name = 'рынок'
        this._description = 'открываю рынок б/у предметы'
        this._aliases = [
            'маркет'
        ]
    }

    async execute(options: BuckwheatCommandOptions): Promise<void> {
        const {
            id,
            ctx
        } = options

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/market/start.pug',
            {
                inlineKeyboard: await LegacyInlineKeyboardManager.get(
                    'market/start',
                    {
                        id
                    }
                )
            }
        )
    }
}