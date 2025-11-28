import ButtonScrollerData from '../../../interfaces/callback-button-data/ButtonScrollerData'
import FaqUtils from '../../../utils/FaqUtils'
import FileUtils from '../../../utils/FileUtils'
import { ButtonScrollerOptions, ButtonScrollerFullOptions, AsyncOrSync, ButtonScrollerEditMessageResult } from '../../../utils/values/types/types'
import ButtonScrollerAction from '../scrollers/button/ButtonScrollerAction'

export default class extends ButtonScrollerAction<string> {
    protected _filename: string = 'faq/list'
    protected _name: string = 'faqchange'

    protected async _getObjects({ }: ButtonScrollerOptions<ButtonScrollerData>): Promise<string[]> {
        return await FaqUtils.getFilenames()
    }
    protected async _editText({
        slicedObjects,
        objects,
        data
    }: ButtonScrollerFullOptions<string, ButtonScrollerData>): Promise<ButtonScrollerEditMessageResult> {
        const length = objects.length
        return {
            text: await FileUtils.readPugFromResource(
                'text/faq/commands/list.pug',
                {
                    changeValues: {
                        length
                    }
                }
            ),
            values: {
                values: {
                    faq: slicedObjects.map(name => {
                        return {
                            data: JSON.stringify({ n: name, p: this._getNewPage(data) - 1 }),
                            text: name
                        }
                    })
                }
            }
        }
    }

}