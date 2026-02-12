import { ZodType } from 'zod'
import { CallbackButtonOptions } from '../../../utils/values/types/action-options'
import CallbackButtonAction from '../CallbackButtonAction'
import ContextUtils from '../../../utils/ContextUtils'
import { craftSchema } from '../../../utils/values/schemas'
import RecipeUtils from '../../../utils/RecipeUtils'
import MessageUtils from '../../../utils/MessageUtils'
import InventoryItemsUtils from '../../../utils/InventoryItemsUtils'
import InventoryItemService from '../../db/services/items/InventoryItemService'
import InlineKeyboardManager from '../../main/InlineKeyboardManager'
import { Recipe } from '../../../utils/values/types/recipes'
import CraftData from '../../../interfaces/callback-button-data/CraftData'
import ArrayUtils from '../../../utils/ArrayUtils'

type Data = CraftData

type ViewableMaterial = {
    title: string
    count: number
    inventoryCount: number
}

type GetMaterialOptions = {
    chatId: number, 
    id: number, 
    recipe: Recipe,
}

export default class extends CallbackButtonAction<Data> {
    protected _schema: ZodType<Data> = craftSchema

    constructor () {
        super()

        this._name = 'craftview'
        this._buttonTitle = 'Крафт: Просмотр'
    }

    private async _getMaterials({
        chatId,
        id,
        recipe,
    }: GetMaterialOptions) {
        const result: ViewableMaterial[] = []
        const inventoryItems = await InventoryItemService.getAll(
            chatId,
            id
        )

        const {
            materials
        } = recipe

        for (const [itemId, count] of Object.entries(materials)) {
            const inventoryItem = InventoryItemsUtils.find(inventoryItems, itemId) ??
                InventoryItemsUtils.getDummyShowableItem()
            const inventoryItemCount = inventoryItem.count ?? 0
            const item = InventoryItemsUtils.getItemDescription(itemId)

            result.push({
                count,
                inventoryCount: inventoryItemCount,
                title: item.name,
            })

        }

        return result
    }

    async execute(options: CallbackButtonOptions<Data>): Promise<string | void> {
        const {
            ctx,
            data,
            chatId
        } = options

        const {
            id,
            index,
            page,
            count = 1
        } = data
        if (await ContextUtils.showAlertIfIdNotEqual(ctx, id)) return

        const recipe = RecipeUtils.get(index)
        const resultItem = InventoryItemsUtils.getItemDescription(recipe.result.name)
        const materials = await this._getMaterials({
            chatId, 
            id,
            recipe,
        })

        const inventoryItem = await InventoryItemService.get(
            chatId,
            id,
            recipe.result.name
        )
        const inventoryCount = inventoryItem?.count

        await MessageUtils.editTextFromResource(
            ctx,
            'text/commands/recipe/view.pug',
            {
                changeValues: {
                    resultItem,
                    recipe,
                    materials,
                    boost: count,
                    inventoryCount
                },
                inlineKeyboard: await InlineKeyboardManager.get(
                    'recipes/view',
                    {
                        globals: {
                            page,
                            id,
                            index,
                            count
                        },
                        values: {
                            count: ArrayUtils.generateMultipliedSequence({
                                maxValue: 200,
                                maxLength: 10,
                                avoidNumber: count,
                                values: [2, 3, 5, 10]
                            }).map(v => {
                                return {
                                    text: `${v}`,
                                    data: {
                                        count: v
                                    }
                                }
                            })
                        }
                    }
                )
            }
        )
    }
}