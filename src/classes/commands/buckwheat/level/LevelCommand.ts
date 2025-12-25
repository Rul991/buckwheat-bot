import MessageUtils from '../../../../utils/MessageUtils'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'
import LevelService from '../../../db/services/level/LevelService'
import LinkedChatService from '../../../db/services/linkedChat/LinkedChatService'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default class LevelCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'уровень'
        this._description = 'показываю твой уровень'
        this._aliases = [
            'левел',
            'лвл',
        ]
    }

    async execute({ ctx, chatId, id }: BuckwheatCommandOptions): Promise<void> {
        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/level/level.pug',
            {
                changeValues: {
                    level: await LevelService.get(chatId, id)
                }
            }
        )
    }
}