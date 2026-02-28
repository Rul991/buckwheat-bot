import ArrayUtils from '../../../../utils/ArrayUtils'
import RandomUtils from '../../../../utils/RandomUtils'
import { CallbackButtonOptions } from '../../../../utils/values/types/action-options'
import { NewScrollerData, ScrollerEditMessageOptions, ScrollerEditMessageResult } from '../../../../utils/values/types/scrollers'
import ScrollerAction from './ScrollerAction'

type Data = {
    value: number
}

export default class extends ScrollerAction<Data> {
    protected _keyboardFilename: string = 'test'

    constructor () {
        super()
        this._name = 'testscr'
        this._objectsPerPage = 5
    }

    protected async _getRawObjects(_: CallbackButtonOptions<NewScrollerData<{}>>): Promise<Data[]> {
        const min = 1
        const max = 99
        const randomMax = RandomUtils.range(min, max)

        return ArrayUtils.range(min, randomMax)
            .map(value => ({
                type: 'level',
                value
            }))
    }

    protected async _editMessage(options: ScrollerEditMessageOptions<Data, {}>): Promise<ScrollerEditMessageResult> {
        const {
            slicedObjects,
            page
        } = options

        return {
            keyboard: {
                values: {
                    object: slicedObjects.map((data) => {
                        return {
                            text: `(${data.value} / ${page})`,
                            data
                        }
                    })
                }
            }
        }
    }
}