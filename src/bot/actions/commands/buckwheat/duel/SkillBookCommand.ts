import InventoryItemService from "../../../../../db/services/items/InventoryItemService"
import { skillsBookItem } from "../../../../../resources/items/inventory"
import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import RankUtils from "../../../../../utils/db/RankUtils"
import SkillPresenter from "../../../../../utils/duel/skill/SkillPresenter"
import BuckwheatCommand from "../../../base/BuckwheatCommand"

export default class SkillBookCommand extends BuckwheatCommand {
    override aliases: string[] = ['эффекты', 'эффект', 'книга']
    override filename: string = 'skill-book'
    override minimumRank: number = RankUtils.min
    override settingId: number = 188
    override name: string = 'книга-навыков'

    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            ctx,
            chatId,
            id
        } = options

        const hasBook = await InventoryItemService.hasByUser({
            chatId,
            id,
            item: skillsBookItem
        })

        if (!hasBook) {
            return {
                key: 'skills/message/book/no-book',
                options: {
                    vars: {
                        item: skillsBookItem.getVars(ctx)
                    }
                }
            }
        }

        return await SkillPresenter.bookMenu(ctx)
    }
}