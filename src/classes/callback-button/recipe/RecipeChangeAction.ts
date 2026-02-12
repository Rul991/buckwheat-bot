import ButtonScrollerData from '../../../interfaces/callback-button-data/ButtonScrollerData'
import FileUtils from '../../../utils/FileUtils'
import InventoryItemsUtils from '../../../utils/InventoryItemsUtils'
import RecipeUtils from '../../../utils/RecipeUtils'
import StringUtils from '../../../utils/StringUtils'
import { Recipe } from '../../../utils/values/types/recipes'
import { ButtonScrollerOptions, ButtonScrollerFullOptions, ButtonScrollerEditMessageResult } from '../../../utils/values/types/types'
import RecipeService from '../../db/services/items/RecipeService'
import ButtonScrollerAction from '../scrollers/button/ButtonScrollerAction'

type Data = Recipe

export default class extends ButtonScrollerAction<Data> {
    protected _filename: string = 'recipes/change'

    constructor () {
        super()
        this._name = 'recipechange'
        this._buttonTitle = 'Рецепт: Пролистывание'
    }

    protected async _getObjects({
        chatId,
        id
    }: ButtonScrollerOptions<ButtonScrollerData>): Promise<Data[]> {
        return await RecipeService.getAvailable(
            chatId,
            id
        )
    }

    protected async _editText({
        slicedObjects,
        id,
        data
    }: ButtonScrollerFullOptions<Data, ButtonScrollerData>): Promise<ButtonScrollerEditMessageResult> {
        const newPage = this._getNewPage(data)
        const pageIndex = newPage * this._buttonsPerPage

        return {
            text: await FileUtils.readPugFromResource(
                'text/commands/recipe/start.pug'
            ),
            values: {
                values: {
                    craft: slicedObjects.map((recipe, i) => {
                        const {
                            result: {
                                name,
                                count = 1
                            }
                        } = recipe
                        const resultItem = InventoryItemsUtils.getItemDescription(name)

                        return {
                            text: `${resultItem.name} x${StringUtils.toFormattedNumber(count)}`,
                            data: JSON.stringify({
                                id,
                                index: pageIndex + i,
                            })
                        }
                    })
                },
                globals: {
                    page: JSON.stringify({ page: newPage })
                }
            }
        }
    }
}