import type { BuckwheatCommandOptions } from "../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import { startExportImportKeyboard } from "../../../keyboards/export-import"
import BuckwheatCommand from "../../base/BuckwheatCommand"

export default class ExportImportCommand extends BuckwheatCommand {
    override aliases: string[] = ['импорт', 'экспорт']
    override filename: string = 'export-import'
    override minimumRank: number = RankUtils.min
    override settingId: number = 106
    override name: string = 'экспорт-импорт'
    
    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            id,
            ctx
        } = options

        return {
            key: 'export-import/message/start',
            options: {
                keyboard: await startExportImportKeyboard(
                    ctx,
                    {
                        id
                    }
                )
            }
        }
    }
}