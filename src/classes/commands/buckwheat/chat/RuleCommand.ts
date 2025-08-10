import { Context } from 'telegraf'
import { MaybeString } from '../../../../utils/types'
import BuckwheatCommand from '../../base/BuckwheatCommand'
import StringUtils from '../../../../utils/StringUtils'
import MessageUtils from '../../../../utils/MessageUtils'
import UserRankService from '../../../db/services/user/UserRankService'
import RankUtils from '../../../../utils/RankUtils'
import RulesService from '../../../db/services/chat/RulesService'

export default class RuleCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'правила'
    }

    private _deleteRule(data: string) {

    }

    private _editRule(data: string) {

    }

    private _addRule(data: string) {

    }

    async execute(ctx: Context, other: MaybeString): Promise<void> {
        const id = ctx.from?.id ?? 0

        if(!other) {
            const rules = await RulesService.get()
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/rules/start.pug',
                {
                    inlineKeyboard: ['rules', '-1'],
                    changeValues: {
                        count: rules.length
                    }
                }
            )
        }
        else {
            const rank = await UserRankService.get(id)
            if(rank < RankUtils.adminRank) {
                await MessageUtils.answerMessageFromResource(
                    ctx,
                    'text/commands/rules/noAdmin.pug'
                )
                return
            }

            const [command, data] = StringUtils.splitBySpace(other)
            if(!data) {
                await MessageUtils.answerMessageFromResource(
                    ctx,
                    'text/commands/rules/noData.pug',
                    {changeValues: {command}}
                )
            }
        }
    }
}