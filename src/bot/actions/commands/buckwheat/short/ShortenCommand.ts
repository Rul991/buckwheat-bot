import ShortCommand from "../../../../../db/entities/short/ShortCommand"
import ShortCommandService from "../../../../../db/services/short/ShortCommandService"
import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import RankUtils from "../../../../../utils/db/RankUtils"
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
    override needData: boolean = true

    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            id,
            ctx,
            other = ''
        } = options

        const commands = StringUtils.splitByCommands(other, 1)
        if (commands.length >= 2) {
            const [command, text] = commands
            const shortCommand = await ShortCommandService.create(
                new ShortCommand({
                    id,
                    command: command!.toLowerCase(),
                    text: text!
                })
            )

            return {
                key: 'shorten/conversation/new',
                options: {
                    vars: {
                        shortCommand,
                        vars: {
                            user: await ctx.vars.user.get()
                        }
                    }
                }
            }
        }

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
}