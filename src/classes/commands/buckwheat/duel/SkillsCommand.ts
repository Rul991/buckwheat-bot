import MessageUtils from '../../../../utils/MessageUtils'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'
import UserClassService from '../../../db/services/user/UserClassService'
import InlineKeyboardManager from '../../../main/InlineKeyboardManager'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default class SkillsCommand extends BuckwheatCommand {
    protected _settingId: string = 'skills'

    constructor() {
        super()
        this._name = 'навыки'
        this._aliases = [
            'навык',
            'скиллы',
            'спеллы'
        ]
        this._description = 'позволяю работать с навыками'
    }

    async execute({ ctx, chatId, id }: BuckwheatCommandOptions): Promise<void> {
        if(!await UserClassService.isPlayer(chatId, id)) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/skills/not-player.pug'
            )
            return
        }

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/skills/menu.pug',
            {
                inlineKeyboard: await InlineKeyboardManager.get(
                    'skills/menu', 
                    JSON.stringify({id})
                )
            }
        )
    }
}