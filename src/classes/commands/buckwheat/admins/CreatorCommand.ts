import BuckwheatCommand from '../../base/BuckwheatCommand'
import UserRankService from '../../../db/services/user/UserRankService'
import RankUtils from '../../../../utils/RankUtils'
import ContextUtils from '../../../../utils/ContextUtils'
import MessageUtils from '../../../../utils/MessageUtils'
import { DEV_ID } from '../../../../utils/values/consts'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'

export default class CreatorCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'создатель'
        this._description = 'повышаю твой ранг до Гниды, если ты являешься создателем беседы.'
        this._aliases = ['гнида']
        this._minimumRank = RankUtils.max
    }

    async execute({ ctx, id, chatId }: BuckwheatCommandOptions): Promise<void> {
        let member = await ContextUtils.getChatMember(ctx, id)

        if(member?.status == 'creator' || id == DEV_ID) {
            await UserRankService.update(chatId, id, RankUtils.max)
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/creator/done.pug',
                {
                    changeValues: {
                        rank: RankUtils.getRankByNumber(RankUtils.max)
                    }
                }
            )
            return
        }

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/creator/error.pug'
        )
    }
}