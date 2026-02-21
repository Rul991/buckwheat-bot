import { ZodType } from 'zod'
import MarketData from '../../../../interfaces/callback-button-data/MarketData'
import MarketSlot from '../../../../interfaces/schemas/market/MarketSlot'
import FileUtils from '../../../../utils/FileUtils'
import InventoryItemsUtils from '../../../../utils/InventoryItemsUtils'
import StringUtils from '../../../../utils/StringUtils'
import { marketDataSchema } from '../../../../utils/values/schemas'
import { ButtonScrollerEditMessageResult, ButtonScrollerFullOptions, ButtonScrollerOptions } from '../../../../utils/values/types/types'
import MarketSlotService from '../../../db/services/market/MarketSlotService'
import ButtonScrollerAction from '../../scrollers/button/ButtonScrollerAction'

type Data = MarketSlot
type ButtonScrollerData = MarketData

export default abstract class extends ButtonScrollerAction<Data, ButtonScrollerData> {
    protected _filename: string = ''
    protected _schema: ZodType<ButtonScrollerData> = marketDataSchema

    constructor () {
        super()
    }

    protected async _getObjects({
        chatId,
        data: {
            itemId
        }
    }: ButtonScrollerOptions<ButtonScrollerData>): Promise<Data[]> {
        const result = await MarketSlotService.getAll({
            chatId,
            itemId
        })

        return result.sort((a, b) => {
            return a.itemId > b.itemId ? 1 : -1
        })
    }

    protected async _editText({
        data,
        slicedObjects
    }: ButtonScrollerFullOptions<Data, ButtonScrollerData>): Promise<ButtonScrollerEditMessageResult> {
        const {
            itemId: globalItemId,
            id: userId
        } = data

        const globalItemDescription = globalItemId ?
            InventoryItemsUtils.getItemDescription(globalItemId) :
            undefined

        const page = this._getNewPage(data)

        return {
            values: {
                values: {
                    slot: slicedObjects.map(({
                        itemId,
                        count: rawCount,
                        id,
                        price: rawPrice
                    }) => {
                        const { name } = globalItemDescription ?? InventoryItemsUtils.getItemDescription(itemId)
                        const count = StringUtils.toFormattedNumber(rawCount)
                        const price = StringUtils.toFormattedNumber(rawPrice)

                        return {
                            text: `${name} x${count} (${price}💰)`,
                            data: JSON.stringify({
                                slot: id,
                                page,
                                id: userId,
                                hasItemId: globalItemId ? 1 : undefined
                            })
                        }
                    })
                },

                globals: {
                    itemId: JSON.stringify({
                        itemId: globalItemId,
                    }),
                    id: userId,
                    toInventory: globalItemId ?
                        `invshow_${JSON.stringify({
                            page: 0,
                            id: userId,
                            itemId: globalItemId
                        })}` :
                        `invchange_${JSON.stringify({
                            c: 0,
                            i: 0,
                            id: userId
                        })}`
                }
            },
            text: await FileUtils.readPugFromResource(
                `text/commands/${this._filename}.pug`,
                {
                    changeValues: {
                        item: globalItemDescription
                    }
                }
            )
        }
    }
}