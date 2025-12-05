import MessageUtils from '../../../../utils/MessageUtils'
import { TextContext, MaybeString } from '../../../../utils/values/types/types'
import InlineKeyboardManager from '../../../main/InlineKeyboardManager'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default class extends BuckwheatCommand {
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

    async execute(ctx: TextContext, _: MaybeString): Promise<void> {
        const id = ctx.from.id
        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/cards/start.pug',
            {
                inlineKeyboard: await InlineKeyboardManager.get(
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