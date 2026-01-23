import MessageUtils from '../../../../utils/MessageUtils'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'
import HelloService from '../../../db/services/chat/HelloService'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default class HelloCommand extends BuckwheatCommand {
    protected _settingId: string = 'hello'

    constructor() {
        super()
        this._name = 'приветствие'
        this._description = 'редактирую сообщение, которые отправляется при входе нового игрока'
        this._needData = true
        this._argumentText = 'текст приветствия'
        this._aliases = [
            'привет',
        ]
    }

    async execute({ ctx, other, chatId }: BuckwheatCommandOptions): Promise<void> {
        if(!other) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/hello/no-other.pug',
                {
                    changeValues: {
                        text: await HelloService.get(chatId)
                    }
                }
            )
            return
        }
        
        await HelloService.edit(chatId, other)
        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/hello/done.pug',
        )
    }
}