import { exec } from "child_process"
import { IS_PROD } from "../../../../../consts/env"
import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import MessageEntityUtils from "../../../../../utils/bot/MessageEntityUtils"
import BuckwheatCommand from "../../../base/BuckwheatCommand"
import MessageUtils from "../../../../../utils/bot/MessageUtils"
import Logger from "../../../../../utils/logs/Logger"
import type { BotContext } from "../../../../../types/bot"
import { cookieItem, inventoryItems, newGameItem } from "../../../../../resources/items/inventory"
import InventoryItemService from "../../../../../db/services/items/InventoryItemService"
import AwardService from "../../../../../db/services/award/AwardService"
import UserService from "../../../../../db/services/user/UserService"
import type User from "../../../../../db/entities/user/User"
import MarketSlotService from "../../../../../db/services/market/MarketSlotService"
import MarketSlot from "../../../../../db/entities/market/MarketSlot"

type ShowAwardOptions = {
    ctx: BotContext,
    chatId: number
    id: number
}

type GetUserOptions = {
    chatId: number
    id: number
    needId: number
    ctx: BotContext
}


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

    private async _giveItems(chatId: number, id: number) {
        const count = 1_000_000
        for (const item of inventoryItems) {
            await InventoryItemService.add({
                chatId,
                id,
                item,
                count
            })
        }
    }

    protected async _getUser({ chatId, id, needId, ctx }: GetUserOptions): Promise<User | undefined> {
        return needId == id ?
            await ctx.vars.user.get() :
            await UserService.get(chatId, needId)
    }

    private async _showAward({
        ctx,
        chatId,
        id
    }: ShowAwardOptions) {
        const award = await AwardService.get(4)
        if (!award) {
            return {
                key: 'award/message/not-exist'
            }
        }

        const giver = await this._getUser({
            ctx,
            chatId,
            id,
            needId: award.giverId
        })

        const owner = await this._getUser({
            ctx,
            chatId,
            id,
            needId: award.id
        })

        await MessageUtils.reply(
            ctx,
            'award/message/show',
            {
                vars: {
                    award,
                    giver,
                    owner
                }
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


        const html = MessageEntityUtils.messageToHtml(ctx.msg)
        if (other) {
            return this._htmlToPug(ctx, html)
        }

        await this._giveItems(chatId, id)

        await MarketSlotService.create(
            new MarketSlot({
                chatId,
                seller: id,
                price: 100,
                item: newGameItem,
                count: 51000
            })
        )

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