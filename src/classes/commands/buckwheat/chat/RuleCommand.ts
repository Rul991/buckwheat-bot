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

    private async _deleteRule(data: string): Promise<boolean> {
        if(isNaN(+data)) {
            return false
        }

        const index = +data - 1
        const rules = await RulesService.get()

        await RulesService.delete(index)
        return index >= 0 && index < rules.length
    }

    private async _addRule(data: string): Promise<boolean> {
        await RulesService.add(data)
        return true
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
            const [command, ...nonSplittedData] = StringUtils.splitBySpace(other)
            const data = nonSplittedData.join(' ')

            if(rank < RankUtils.adminRank) {
                await MessageUtils.answerMessageFromResource(
                    ctx,
                    'text/commands/rules/noAdmin.pug'
                )
                return
            }

            if(!data) {
                await MessageUtils.answerMessageFromResource(
                    ctx,
                    'text/commands/rules/help.html'
                )
                return
            }

            switch (command) {
                case 'добавить':
                    await this._addRule(data)
                    await MessageUtils.answerMessageFromResource(
                        ctx,
                        'text/commands/rules/done/add.pug'
                    )
                    return

                case 'удалить':
                    const isDeleted = await this._deleteRule(data)
                    if(isDeleted) {
                        await MessageUtils.answerMessageFromResource(
                            ctx,
                            'text/commands/rules/done/delete.pug',
                            {
                                changeValues: {
                                    number: +data
                                }
                            }
                        )
                    }
                    else {
                        await MessageUtils.answerMessageFromResource(
                            ctx,
                            'text/commands/rules/help/delete.html'
                        )
                    }
                    return
            
                default:
                    await MessageUtils.answerMessageFromResource(
                        ctx,
                        'text/commands/rules/help.html'
                    )
                    return
            }
        }
    }
}