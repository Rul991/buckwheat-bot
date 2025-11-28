import { JSONSchemaType } from 'ajv'
import { ButtonScrollerOptions, ButtonScrollerFullOptions, AsyncOrSync, ButtonScrollerEditMessageResult, CurrentIncreaseId, SettingWithId } from '../../../utils/values/types/types'
import ChatSettingsService from '../../db/services/settings/ChatSettingsService'
import ButtonScrollerAction from '../scrollers/button/ButtonScrollerAction'
import StringUtils from '../../../utils/StringUtils'
import FileUtils from '../../../utils/FileUtils'

type Data = {
    c: number
    i: number
    id: number
}

type Object = SettingWithId

export default class extends ButtonScrollerAction<Object, Data> {
    protected _filename: string = 'settings/change'
    protected _schema: JSONSchemaType<Data> = {
        type: 'object',
        properties: {
            c: {
                type: 'number'
            },
            i: {
                type: 'number'
            },
            id: {
                type: 'number'
            }
        },
        required: ['c', 'i', 'id']
    }

    protected _getCurrentIncreaseIdNames(): CurrentIncreaseId<Data> {
        return {
            current: 'c',
            increase: 'i',
            id: 'id'
        }
    }

    constructor () {
        super()
        this._name = 'setch'
    }

    protected async _getObjects({
        chatId,
    }: ButtonScrollerOptions<Data>): Promise<Object[]> {
        return await ChatSettingsService.getAll(chatId)
    }

    protected _getShowValueValue(defaultValue: any): string {
        return StringUtils.getShowValue(defaultValue)
    }

    protected async _editText({
        id,
        slicedObjects,
        data
    }: ButtonScrollerFullOptions<Object, Data>): Promise<ButtonScrollerEditMessageResult> {
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
                                p: this._getNewPage(data) - 1
                            }),
                            text: `${title} [${value}]`
                        })
                    })
                }
            }
        }
    }
}