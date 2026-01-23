import BuckwheatCommand from '../../base/BuckwheatCommand'
import UserRankService from '../../../db/services/user/UserRankService'
import RankUtils from '../../../../utils/RankUtils'
import ContextUtils from '../../../../utils/ContextUtils'
import MessageUtils from '../../../../utils/MessageUtils'
import { DEV_ID } from '../../../../utils/values/consts'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'
import RankSettingsService from '../../../db/services/settings/RankSettingsService'

export default class CreatorCommand extends BuckwheatCommand {
    protected _settingId: string = 'creator'

    constructor () {
        super()
        this._name = 'создатель'
        this._description = 'повышаю твой ранг до Гниды, если ты являешься создателем беседы.'
        this._aliases = ['гнида']
        this._minimumRank = RankUtils.max
    }

    async execute({ ctx, id, chatId }: BuckwheatCommandOptions): Promise<void> {
        const rankName = await RankSettingsService.get<'string'>(chatId, `rank-${RankUtils.max}`)

        await UserRankService.update(chatId, id, RankUtils.max)
        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/creator/done.pug',
            {
                changeValues: {
                    rank: rankName
                }
            }
        )
    }
}