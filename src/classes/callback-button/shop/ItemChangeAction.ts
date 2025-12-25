import ContextUtils from '../../../utils/ContextUtils'
import ShopItems from '../../../utils/ShopItems'
import { ShopItemWithLength, ScrollerEditMessageResult, ScrollerSendMessageOptions, ButtonScrollerEditMessageResult, ButtonScrollerFullOptions, ShopItem, TinyCurrentIncreaseId, CurrentIncreaseIdNames, ButtonScrollerOptions, JsonShopItem } from '../../../utils/values/types/types'
import { CallbackButtonContext } from '../../../utils/values/types/contexts'
import PremiumChatService from '../../db/services/chat/PremiumChatService'
import ButtonScrollerAction from '../scrollers/button/ButtonScrollerAction'
import { JSONSchemaType } from 'ajv'
import { tinyCurrentIncreaseIdSchema } from '../../../utils/values/schemas'
import FileUtils from '../../../utils/FileUtils'
import StringUtils from '../../../utils/StringUtils'

type Data = TinyCurrentIncreaseId

export default class ItemChangeAction extends ButtonScrollerAction<ShopItem, Data> {
    protected _filename: string = 'shop/change'
    protected _schema: JSONSchemaType<Data> = tinyCurrentIncreaseIdSchema

    protected _getCurrentIncreaseIdNames(): CurrentIncreaseIdNames<Data> {
        return {
            current: 'c',
            increase: 'i',
            id: 'id'
        }
    }

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
                            data: JSON.stringify({
                                id,
                                p: page,
                                i: page * this._buttonsPerPage + i
                            })
                        }
                    })
                }
            }
        }
    }
}