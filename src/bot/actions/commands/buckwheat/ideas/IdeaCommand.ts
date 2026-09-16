import Idea from "../../../../../db/entities/ideas/Idea"
import IdeaService from "../../../../../db/services/ideas/IdeaService"
import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import MessageEntityUtils from "../../../../../utils/bot/MessageEntityUtils"
import RankUtils from "../../../../../utils/db/RankUtils"
import { startIdeaKeyboard } from "../../../../keyboards/idea"
import BuckwheatCommand from "../../../base/BuckwheatCommand"

export default class IdeaCommand extends BuckwheatCommand {
    protected override _rankCanBeChange: boolean = false
    override aliases: string[] = ['идея', 'предложить', 'предлагаю']
    override minimumRank: number = RankUtils.min
    override settingId: number = 43
    override name: string = 'идеи'
    override filename: string = 'idea'
    override needData: boolean = true

    private async _addIdea(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            ctx,
            chatId,
            id
        } = options
        const message = ctx.msg
        const text = MessageEntityUtils.messageToHtml(message)

        await IdeaService.create(new Idea({
            author: [chatId, id],
            text
        }))

        return {
            key: 'idea/new'
        }
    }

    private async _getStartMessage(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            ctx,
            id
        } = options

        return {
            key: 'idea/start',
            options: {
                keyboard: await startIdeaKeyboard(ctx, { id })
            }
        }
    }

    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            other
        } = options

        if (other) {
            return await this._addIdea(options)
        }

        return await this._getStartMessage(options)
    }
}