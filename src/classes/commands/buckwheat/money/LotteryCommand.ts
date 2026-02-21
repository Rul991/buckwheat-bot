import MessageUtils from '../../../../utils/MessageUtils'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'
import InlineKeyboardManager from '../../../main/InlineKeyboardManager'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default class extends BuckwheatCommand {
    protected _settingId: string = 'lottery'

    constructor () {
        super()
        this._name = 'лотерея'
        this._description = 'позволяю работать с лотереей'
    }

    async execute(options: BuckwheatCommandOptions): Promise<void> {
        const {
            id,
            ctx
        } = options

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/lottery/start.pug',
            {
                inlineKeyboard: await InlineKeyboardManager.get(
                    'lottery/start',
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