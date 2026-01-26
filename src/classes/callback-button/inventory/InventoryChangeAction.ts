import ButtonScrollerData from '../../../interfaces/callback-button-data/ButtonScrollerData'
import FileUtils from '../../../utils/FileUtils'
import { ButtonScrollerEditMessageResult, ButtonScrollerFullOptions, ButtonScrollerOptions, ShowableItem } from '../../../utils/values/types/types'
import InventoryItemService from '../../db/services/items/InventoryItemService'
import ButtonScrollerAction from '../scrollers/button/ButtonScrollerAction'

type Data = ShowableItem

export default class extends ButtonScrollerAction<Data> {
    protected _filename: string = 'inventory/change'
    protected async _getObjects({
        chatId,
        id
    }: ButtonScrollerOptions<ButtonScrollerData>): Promise<ShowableItem[]> {
        return await InventoryItemService.showItems(chatId, id)
    }

    constructor() {
        super()
        this._name = 'invchange'
        this._buttonTitle = 'Инвентарь: Пролистывание'
    }

    protected async _editText({
        slicedObjects,
        id,
        data
    }: ButtonScrollerFullOptions<ShowableItem, ButtonScrollerData>): Promise<ButtonScrollerEditMessageResult> {
        const page = this._getNewPage(data)
        return {
            text: await FileUtils.readPugFromResource(
                'text/commands/inventory/start.pug'
            ),
            values: {
                values: {
                    item: slicedObjects
                        .map(item => {
                            const {
                                name,
                                countText,
                                itemId
                            } = item

                            return {
                                text: `${name} ${countText}`,
                                data: JSON.stringify({
                                    id,
                                    itemId,
                                    page
                                })
                            }
                        })
                },
                globals: {
                    id
                }
            }
        }
    }
}