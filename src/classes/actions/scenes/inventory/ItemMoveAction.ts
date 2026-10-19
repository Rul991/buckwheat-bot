import { User } from "telegraf/types"
import ContextUtils from "../../../../utils/ContextUtils"
import InventoryItemsUtils from "../../../../utils/InventoryItemsUtils"
import MathUtils from "../../../../utils/MathUtils"
import MessageUtils from "../../../../utils/MessageUtils"
import StringUtils from "../../../../utils/StringUtils"
import { SceneOptions } from "../../../../utils/values/types/action-options"
import InventoryItemService from "../../../db/services/items/InventoryItemService"
import SceneAction from "../SceneAction"
import { TextContext } from "../../../../utils/values/types/contexts"

type Data = {
    itemId: string
    chatId: number
    id: number
}

type MoveOptions = Data & {
    replyUser: User
    count: number
    ctx: TextContext
}

export default class extends SceneAction<Data> {
    private _minCount: number = 0

    constructor() {
        super()
        this._name = 'item-move'
    }

    private async _moveItem(options: MoveOptions) {
        const {
            ctx,
            chatId,
            id,
            itemId,
            replyUser,
            count
        } = options

        const replyId = replyUser.id
        const item = InventoryItemsUtils.getItemDescription(itemId)
        const itemName = item.name

        const [isAdded] = await InventoryItemService.add({
            chatId,
            count,
            itemId,
            id: replyId
        })

        if (!isAdded) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'scenes/item-move/cant-add',
                {
                    changeValues: {
                        itemName,
                        count,
                        reply: await ContextUtils.getUser(chatId, replyId)
                    }
                }
            )

            return isAdded
        }

        await MessageUtils.answerMessageFromResource(
            ctx,
            'scenes/item-move/moved',
            {
                changeValues: {
                    itemName,
                    count,
                    reply: await ContextUtils.getUser(chatId, replyId),
                    user: await ContextUtils.getUser(chatId, id),
                }
            }
        )

        await InventoryItemService.sub({
            chatId,
            id,
            itemId,
            count
        })

        return isAdded
    }

    protected async _execute(options: SceneOptions<Data>): Promise<void> {
        const {
            scene
        } = options

        scene.enter(
            async ctx => {
                const {
                    itemId,
                    chatId,
                    id
                } = ctx.scene.state

                const item = InventoryItemsUtils.getItemDescription(itemId)
                const itemName = item.name
                const inventoryItem = await InventoryItemService.get(
                    chatId,
                    id,
                    itemId
                )
                const maxCount = inventoryItem?.count ?? 0

                await MessageUtils.answerMessageFromResource(
                    ctx,
                    'scenes/item-move/enter',
                    {
                        changeValues: {
                            itemName,
                            maxCount,
                            minCount: this._minCount,
                            user: await ContextUtils.getUser(chatId, id)
                        }
                    }
                )
            }
        )

        scene.on(
            'text',
            async ctx => {
                const {
                    itemId,
                    chatId,
                    id
                } = ctx.scene.state

                const replyUser = ctx.message.reply_to_message?.from
                if (!replyUser) {
                    await MessageUtils.answerMessageFromResource(
                        ctx,
                        'scenes/item-move/leave',
                        {
                            changeValues: {
                                user: await ContextUtils.getUser(chatId, id)
                            }
                        }
                    )

                    await ctx.scene.leave()
                    return
                }

                const inventoryItem = await InventoryItemService.get(
                    chatId,
                    id,
                    itemId
                )

                const inputCount = Math.ceil(
                    StringUtils.getNumberFromString(
                        ctx.text,
                        1
                    )
                )

                const minCount = this._minCount
                const maxCount = inventoryItem?.count ?? 0

                if (MathUtils.isClamp(inputCount, minCount, maxCount)) {
                    const isMoved = await this._moveItem({
                        ...ctx.scene.state,
                        replyUser,
                        count: inputCount,
                        ctx: ctx as TextContext
                    })

                    if (isMoved) {
                        await ctx.scene.leave()
                    }
                    return
                }

                await ctx.scene.reenter()
            }
        )
    }
}