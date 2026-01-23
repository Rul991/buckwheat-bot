import ContextUtils from '../../../utils/ContextUtils'
import MathUtils from '../../../utils/MathUtils'
import MessageUtils from '../../../utils/MessageUtils'
import RankUtils from '../../../utils/RankUtils'
import StringUtils from '../../../utils/StringUtils'
import { BuckwheatCommandOptions } from '../../../utils/values/types/action-options'
import { TextContext } from '../../../utils/values/types/contexts'
import AwardsService from '../../db/services/awards/AwardsService'
import BuckwheatCommand from '../base/BuckwheatCommand'

export default class AddAwardCommand extends BuckwheatCommand {
    protected _settingId: string = 'addAward'

    constructor () {
        super()
        this._name = 'наградить'
        this._aliases = [
            'награда',
            'вознаградить',
            'награди'
        ]
        this._description = 'награждаю игрока'
        this._replySupport = true
        this._needData = true
        this._argumentText = '<0-8> <текст>'
        this._minimumRank = RankUtils.moderator
    }

    private _getValuesFromOther(ctx: TextContext, other?: string): [number, string] | null {
        const [rawLevel, text] = StringUtils.splitByCommands(other ?? '', 1)
        const level = +rawLevel

        if (!other || isNaN(level)) {
            return null
        }

        return [level, text]
    }

    async execute({ ctx, other, id, chatId, replyFrom }: BuckwheatCommandOptions): Promise<void> {
        const replyId = replyFrom?.id

        if (!replyId) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/award/no-reply.pug'
            )
            return
        }

        if (replyId == id) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/award/self.pug'
            )
            return
        }

        const values = this._getValuesFromOther(ctx, other)
        if (!values) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/award/wrong.pug'
            )
            return
        }
        const [level, text] = values
        const rank = MathUtils.clamp(level, 1, 8)

        await AwardsService.add(chatId, replyId, {
            rank,
            text
        })

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/award/added.pug', {
            changeValues: {
                level: rank,
                reply: await ContextUtils.getUser(chatId, replyId),
                user: await ContextUtils.getUser(chatId, id)
            }
        }
        )
    }
}