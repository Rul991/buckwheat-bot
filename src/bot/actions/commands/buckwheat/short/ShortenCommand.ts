import { MAX_SHORT_COMMAND_LENGTH } from "../../../../../consts/lengths"
import ShortCommand from "../../../../../db/entities/short/ShortCommand"
import ShortCommandService from "../../../../../db/services/short/ShortCommandService"
import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import RankUtils from "../../../../../utils/db/RankUtils"
import Logger from "../../../../../utils/logs/Logger"
import StringUtils from "../../../../../utils/string/StringUtils"
import { startShortCommandKeyboard } from "../../../../keyboards/short-command"
import BuckwheatCommand from "../../../base/BuckwheatCommand"

export default class ShortenCommand extends BuckwheatCommand {
    override aliases: string[] = ['уменьшить', 'сократить', 'сократи', 'сокращения', 'алиас']
    override filename: string = 'shorten'
    override minimumRank: number = RankUtils.min
    override settingId: number = 73
    override name: string = 'сокращение'
    protected override _rankCanBeChange: boolean = false

    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            id,
            other = '',
            commandStrings,
            ctx
        } = options
        const [botName] = commandStrings

        Logger.debug(
            'ShortenCommand.execute',
            {
                commandStrings,
                msg: ctx.msg.text
            }
        )

        if (!other) {
            return {
                key: 'shorten/list',
                options: {
                    keyboard: await startShortCommandKeyboard(
                        ctx,
                        {
                            id
                        }
                    )
                }
            }
        }

        const value = StringUtils.splitByCommands(other, 1) as [string, string]
        if (value.length < 2) {
            return {
                key: 'shorten/low-length'
            }
        }

        const [rawCommand, text] = value
        const command = rawCommand.slice(0, MAX_SHORT_COMMAND_LENGTH)

        if (command == this.name) {
            return {
                key: 'shorten/wrong-name',
                options: {
                    vars: {
                        name: this.name
                    }
                }
            }
        }

        const shortCommand = await ShortCommandService.create(
            new ShortCommand({
                id,
                command,
                text
            })
        )

        return {
            key: 'shorten/new',
            options: {
                vars: {
                    command,
                    text,
                    isNew: shortCommand.new ?? false,
                    botName,
                    user: await ctx.vars.user.get()
                }
            }
        }
    }
}