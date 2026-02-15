import ButtonScrollerData from '../../../interfaces/callback-button-data/ButtonScrollerData'
import MoneyGenerator from '../../../interfaces/schemas/generator/MoneyGenerator'
import ContextUtils from '../../../utils/ContextUtils'
import FileUtils from '../../../utils/FileUtils'
import GeneratorUtils from '../../../utils/GeneratorUtils'
import StringUtils from '../../../utils/StringUtils'
import { GENERATOR_MAX_COUNT } from '../../../utils/values/consts'
import { ButtonScrollerOptions, ButtonScrollerFullOptions, ButtonScrollerEditMessageResult, Ids } from '../../../utils/values/types/types'
import GeneratorsService from '../../db/services/generators/GeneratorsService'
import InventoryItemService from '../../db/services/items/InventoryItemService'
import ButtonScrollerAction from '../scrollers/button/ButtonScrollerAction'

type Data = MoneyGenerator

export default class extends ButtonScrollerAction<Data> {
    protected _buttonTitle?: string | undefined = "Генератор: Пролистывание"
    constructor () {
        super()

        this._name = 'gc'
        this._filename = 'generator/values'
        this._buttonsPerPage = 4
    }

    protected async _getObjects({
        chatId,
        id,
    }: ButtonScrollerOptions<ButtonScrollerData>): Promise<Data[]> {
        const {
            generators
        } = await GeneratorsService.get(chatId, id)
        return generators
    }

    protected async _getUpgradePrice(
        chatId: number,
        id: number
    ) {
        return await GeneratorsService.getTotalUpgradePrice(chatId, id)
    }

    protected async _editText({
        slicedObjects,
        id,
        chatId,
        ctx,
        data
    }: ButtonScrollerFullOptions<Data, ButtonScrollerData>): Promise<ButtonScrollerEditMessageResult> {
        const generator = await GeneratorsService.get(chatId, id)
        const {
            generators
        } = generator

        const deviceItemId = 'moneyGrindDevice'
        const hasDevices = await InventoryItemService.has({
            chatId,
            id,
            itemId: deviceItemId
        })
        const hasAdd = hasDevices && generators.length < GENERATOR_MAX_COUNT
        const page = this._getNewPage(data)

        const upgradePrice = await this._getUpgradePrice(
            chatId,
            id
        )
        const hasUpgradeAllButton = upgradePrice > 0

        return {
            text: await GeneratorUtils.getInfoMessage({
                chatId,
                id,
                generator
            }),
            values: {
                values: {
                    add: hasAdd ?
                        [
                            {
                                text: '',
                                data: ''
                            }
                        ] :
                        [],
                    upgradeAll: hasUpgradeAllButton ?
                        [
                            {
                                text: StringUtils.toFormattedNumber(upgradePrice),
                                data: ''
                            }
                        ] :
                        [],
                    generators: slicedObjects.map(
                        ({ id: generatorId, level }) => {
                            return {
                                text: `${generatorId + 1} ( ${level}ур. )`,
                                data: JSON.stringify({
                                    i: generatorId,
                                    id,
                                    p: page
                                })
                            }
                        }
                    )
                },
                globals: {
                    collect: JSON.stringify({
                        id,
                        p: page
                    })
                }
            }
        }
    }
}