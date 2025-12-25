import MessageUtils from '../../../../utils/MessageUtils'
import { MaybeString } from '../../../../utils/values/types/types'
import { TextContext } from '../../../../utils/values/types/contexts'
import BuckwheatCommand from '../../base/BuckwheatCommand'
import InlineKeyboardManager from '../../../main/InlineKeyboardManager'
import TopUtils from '../../../../utils/TopUtils'
import RankUtils from '../../../../utils/RankUtils'
import UserRankService from '../../../db/services/user/UserRankService'
import LinkedChatService from '../../../db/services/linkedChat/LinkedChatService'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'

export default class TopCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'топ'
        this._description = 'показываю топ игроков по разным параметрам'
        this._minimumRank = RankUtils.min
    }

    async execute({ ctx, id, chatId }: BuckwheatCommandOptions): Promise<void> {
        if(!await UserRankService.has(chatId, id, this._minimumRank)) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/other/rank-issue.pug',
                {
                    changeValues: {
                        rank: this._minimumRank
                    }
                }
            )
            return
        }

        await MessageUtils.answerMessageFromResource(
            ctx,
            `text/commands/top/start.pug`,
            {
                inlineKeyboard: await InlineKeyboardManager.map(
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