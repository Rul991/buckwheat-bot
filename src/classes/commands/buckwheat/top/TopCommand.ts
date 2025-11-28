import MessageUtils from '../../../../utils/MessageUtils'
import { TextContext, MaybeString } from '../../../../utils/values/types/types'
import BuckwheatCommand from '../../base/BuckwheatCommand'
import InlineKeyboardManager from '../../../main/InlineKeyboardManager'
import TopUtils from '../../../../utils/TopUtils'
import RankUtils from '../../../../utils/RankUtils'
import UserRankService from '../../../db/services/user/UserRankService'
import FileUtils from '../../../../utils/FileUtils'
import LinkedChatService from '../../../db/services/linkedChat/LinkedChatService'

export default class TopCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'топ'
        this._description = 'показываю топ игроков по разным параметрам'
        this._minimumRank = RankUtils.min + 1
    }

    async execute(ctx: TextContext, _: MaybeString): Promise<void> {
        const id = ctx.from.id
        const chatId = await LinkedChatService.getCurrent(ctx, id)
        if(!chatId) return

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