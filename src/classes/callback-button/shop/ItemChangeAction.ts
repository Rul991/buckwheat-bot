import ShopItems from '../../../utils/ShopItems'
import { ShopItemWithLength, ButtonScrollerEditMessageResult, ButtonScrollerFullOptions, ShopItem, TinyCurrentIncreaseId, ButtonScrollerOptions, JsonShopItem } from '../../../utils/values/types/types'
import ButtonScrollerAction from '../scrollers/button/ButtonScrollerAction'
import FileUtils from '../../../utils/FileUtils'
import JsonUtils from '../../../utils/JsonUtils'

type Data = TinyCurrentIncreaseId

export default class ItemChangeAction extends ButtonScrollerAction<ShopItem, Data> {
    protected _filename: string = 'shop/change'
    protected _buttonTitle: string = 'Магазин: Пролистывание'

    constructor () {
        super()
        this._name = 'itemchange'
    }

    protected async _getObjects({ }: ButtonScrollerOptions<Data>): Promise<Required<JsonShopItem>[]> {
        return ShopItems.getAll()
    }

    protected async _editText({
        data,
        slicedObjects
    }: ButtonScrollerFullOptions<ShopItemWithLength, Data>): Promise<ButtonScrollerEditMessageResult> {
        const {
            id
        } = data

        return {
            text: await FileUtils.readPugFromResource(
                'text/commands/shop/default.pug'
            ),
            values: {
                values: {
                    item: slicedObjects.map((v, i) => {
                        const {
                            name,
                            emoji
                        } = v
                        const page = this._getNewPage(data)
                        return {
                            text: `${name} ${emoji}`,
                            data: JsonUtils.stringify({
                                id,
                                p: page,
                                i: page * this._buttonsPerPage + i
                            })
                        }
                    })
                },
                globals: {
                    id: JsonUtils.stringify(id)
                }
            },
        }
    }
}