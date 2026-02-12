import MessageUtils from '../../../../utils/MessageUtils'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'
import UserClassService from '../../../db/services/user/UserClassService'
import InlineKeyboardManager from '../../../main/InlineKeyboardManager'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default class extends BuckwheatCommand {
    protected _settingId: string = 'craft'
    constructor() {
        super()
        this._name = 'крафт'
        this._aliases = [
            'рецепт',
            'рецепты',
            'изготовить',
            'скрафтить',
            'инженер'
        ]
        this._description = 'выдаю инженеру рецепты и позволяю изготавливать предметы'
    }

    async execute(options: BuckwheatCommandOptions): Promise<void> {
        const {
            chatId,
            id,
            ctx
        } = options

        const className = await UserClassService.get(chatId, id)
        if(className != 'engineer') {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/recipe/not-engineer.pug'
            )
            return
        }

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/recipe/start.pug',
            {
                inlineKeyboard: await InlineKeyboardManager.get(
                    'recipes/start',
                    {
                        globals: {
                            id
                        }
                    }
                )
            }
        )
    }
}