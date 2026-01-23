import { ButtonScrollerOptions, ButtonScrollerFullOptions, ButtonScrollerEditMessageResult, SettingWithId, TinyCurrentIncreaseId } from '../../../utils/values/types/types'
import ButtonScrollerAction from '../scrollers/button/ButtonScrollerAction'
import StringUtils from '../../../utils/StringUtils'
import FileUtils from '../../../utils/FileUtils'
import { object, string, ZodType } from 'zod'
import { tinyCurrentIncreaseIdSchema } from '../../../utils/values/schemas'
import SettingUtils from '../../../utils/settings/SettingUtils'
import SettingsService from '../../db/services/settings/SettingsService'
import { DEFAULT_SETTINGS_TYPE } from '../../../utils/values/consts'

type Data = TinyCurrentIncreaseId & {
    t?: string
}
type Object = SettingWithId

export default class extends ButtonScrollerAction<Object, Data> {
    protected _buttonTitle: string = 'Настройки: Пролистывание'
    protected _canBeUseInPrivateWithoutRank: boolean = true
    protected _filename: string = 'settings/change'
    protected _schema: ZodType<Data> = tinyCurrentIncreaseIdSchema
        .and(object({
            t: string().optional()
        }))

    constructor () {
        super()
        this._name = 'setch'
        this._buttonsPerPage = 7
    }

    protected async _getObjects({
        id: userId,
        chatId,
        data: {
            t: type = DEFAULT_SETTINGS_TYPE,
            id = userId
        }
    }: ButtonScrollerOptions<Data>): Promise<Object[]> {
        const settingsId = SettingUtils.getSettingsId(chatId, id, type)
        return await SettingsService.getSettingsArray(settingsId, type)
    }

    protected _getShowValueValue(defaultValue: any): string {
        return StringUtils.getShowValue(defaultValue)
    }

    protected async _editText({
        id,
        slicedObjects,
        data
    }: ButtonScrollerFullOptions<Object, Data>): Promise<ButtonScrollerEditMessageResult> {
        const {
            t: type
        } = data

        return {
            text: await FileUtils.readPugFromResource('text/commands/settings/done.pug'),
            values: {
                values: {
                    settings: slicedObjects.map(({ id: objId, title, default: defaultValue }) => {
                        const value = this._getShowValueValue(defaultValue)
                        return ({
                            data: JSON.stringify({
                                n: objId,
                                id,
                                p: this._getNewPage(data) - 1,
                                t: type
                            }),
                            text: `${title} [${value}]`
                        })
                    })
                },
                globals: {
                    type: JSON.stringify({
                        t: type
                    })
                }
            }
        }
    }
}