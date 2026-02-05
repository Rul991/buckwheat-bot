import MessageUtils from '../../../../utils/MessageUtils'
import { MaybeString } from '../../../../utils/values/types/types'
import { TextContext } from '../../../../utils/values/types/contexts'
import BuckwheatCommand from '../../base/BuckwheatCommand'
import LegacyInlineKeyboardManager from '../../../main/LegacyInlineKeyboardManager'
import TopUtils from '../../../../utils/TopUtils'
import RankUtils from '../../../../utils/RankUtils'
import UserRankService from '../../../db/services/user/UserRankService'
import LinkedChatService from '../../../db/services/linkedChat/LinkedChatService'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'

export default class TopCommand extends BuckwheatCommand {
    protected _settingId: string = 'top'

    constructor() {
        super()
        this._name = 'топ'
        this._description = 'показываю топ игроков по разным параметрам'
        this._minimumRank = RankUtils.min
    }

    async execute({ ctx }: BuckwheatCommandOptions): Promise<void> {
        await MessageUtils.answerMessageFromResource(
            ctx,
            `text/commands/top/start.pug`,
            {
                inlineKeyboard: await LegacyInlineKeyboardManager.map(
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