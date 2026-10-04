import { exec } from "node:child_process"
import { DEV_ID } from "../../../../../consts/env"
import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import RankUtils from "../../../../../utils/db/RankUtils"
import BuckwheatCommand from "../../../base/BuckwheatCommand"
import MessageUtils from "../../../../../utils/bot/MessageUtils"
import Logger from "../../../../../utils/logs/Logger"

export default class UpdateCommand extends BuckwheatCommand {
    override aliases: string[] = []
    override filename: string = ''
    override minimumRank: number = RankUtils.min
    override settingId: number = 116
    override name: string = 'обновить'
    override isShow: boolean = false

    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            id,
            ctx
        } = options

        if (id != DEV_ID) {
            return {
                key: 'commands/system/not-exist'
            }
        }

        exec(
            'git pull && bun restart:prod',
            async (error) => {
                if (error) {
                    Logger.error(
                        'UpdateCommand.execute',
                        {
                            error
                        }
                    )
                    await MessageUtils.reply(
                        ctx,
                        'dev/not-update'
                    )
                    return
                }

                await MessageUtils.reply(
                    ctx,
                    'dev/update'
                )
            }
        )
    }
}