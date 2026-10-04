import { exec } from "child_process"
import { IS_PROD } from "../../../../../consts/env"
import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import MessageEntityUtils from "../../../../../utils/bot/MessageEntityUtils"
import BuckwheatCommand from "../../../base/BuckwheatCommand"
import MessageUtils from "../../../../../utils/bot/MessageUtils"
import Logger from "../../../../../utils/logs/Logger"
import type { BotContext } from "../../../../../types/bot"
import { inventoryItems } from "../../../../../resources/items/inventory"
import InventoryItemService from "../../../../../db/services/items/InventoryItemService"

export default class DevCommand extends BuckwheatCommand {
    override name: string = 'дев'
    override aliases: string[] = []
    override minimumRank: number = 0
    override isShow: boolean = false
    override settingId: number = 10
    override filename: string = ''

    private _htmlToPug(ctx: BotContext, html: string) {
        const marked = html.replace(/\n/g, '<br data-nl/>')

        exec(`printf %s ${JSON.stringify(marked)} | bunx xhtml2pug -b -s 4`,
            async (_, stdout) => {
                const pug = stdout.replace(
                    /^([ \t]*)br\(data-nl\)[ \t]*$/gm,
                    (_: string, indent: string, offset: number, full: string) => {
                        const before = full.slice(0, offset)
                        const lastNL = before.lastIndexOf('\n', before.length - 2)
                        const prevLine = lastNL === -1
                            ? before.slice(0, Math.max(0, before.length - 1))
                            : before.slice(lastNL + 1, before.length - 1)

                        if (prevLine.includes('|')) {
                            return indent + '|'
                        }
                        return indent + '|\n' + indent + '|'
                    }
                )
                const vars = {
                    pugText: pug,
                }

                Logger.debug(
                    'html to pug',
                    vars
                )
                await MessageUtils.reply(
                    ctx,
                    'dev/pug',
                    {
                        vars
                    }
                )
            }
        )
    }

    private async _dev(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            ctx,
            other,
            chatId,
            id
        } = options
        const count = 1_000_000

        const html = MessageEntityUtils.messageToHtml(ctx.msg)
        if(other) {
            return this._htmlToPug(ctx, html)
        }

        for (const item of inventoryItems) {
            await InventoryItemService.add({
                chatId,
                id,
                item,
                count
            })
        }

        return {
            key: 'dev/done'
        }
    }

    private async _prod(_options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        return {
            key: 'dev/todo'
        }
    }

    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        if (IS_PROD) {
            return this._prod(options)
        }

        return this._dev(options)
    }
}