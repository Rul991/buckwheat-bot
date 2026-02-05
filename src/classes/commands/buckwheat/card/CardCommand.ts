import MessageUtils from '../../../../utils/MessageUtils'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'
import LegacyInlineKeyboardManager from '../../../main/LegacyInlineKeyboardManager'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default class extends BuckwheatCommand {
    protected _settingId: string = 'card'

    constructor () {
        super()
        this._name = 'карточки'
        this._aliases = [
            'карты',
            'карта',
            'коллекция',
            'карточка'
        ]
        this._description = 'открываю меню с карточками'
    }

    async execute({ ctx, id }: BuckwheatCommandOptions): Promise<void> {
        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/cards/start.pug',
            {
                inlineKeyboard: await LegacyInlineKeyboardManager.get(
                    'cards/start',
                    {
                        collection: id,
                        json: JSON.stringify({ id })
                    }
                )
            }
        )
    }
}